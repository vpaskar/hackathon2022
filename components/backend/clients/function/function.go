package function

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"log"

	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/util/retry"

	serverlessv1alpha1 "github.com/kyma-project/kyma/components/function-controller/pkg/apis/serverless/v1alpha1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/dynamic"
)

type Client struct {
	client dynamic.Interface
}

func NewClient(client dynamic.Interface) Client {
	return Client{client}
}

func (c Client) GetFnJson(name, namespace string) (*unstructured.Unstructured, error) {
	functionUnstructured, err := c.client.Resource(GroupVersionResource()).Namespace(namespace).Get(
		context.Background(), name, metav1.GetOptions{})

	if err != nil {
		return nil, err
	}
	return functionUnstructured, nil
}

func (c Client) UpdateFunction(fn serverlessv1alpha1.Function) (*unstructured.Unstructured, error) {

	mapInterfaceFn, err := runtime.DefaultUnstructuredConverter.ToUnstructured(&fn)
	if err != nil {
		return nil, err
	}

	retryErr := retry.RetryOnConflict(retry.DefaultRetry, func() error {

		result, getErr := c.GetFnJson(fn.Name, fn.Namespace)
		if getErr != nil {
			log.Printf("failed to get latest version of function: %v", getErr)
			return err
		}

		if err := unstructured.SetNestedField(result.Object, mapInterfaceFn["spec"], "spec"); err != nil {
			return err
		}

		_, updateErr := c.client.Resource(GroupVersionResource()).Namespace(fn.Namespace).Update(context.Background(), result, metav1.UpdateOptions{})
		return updateErr
	})

	if retryErr != nil {
		return nil, err
	}

	return c.GetFnJson(fn.Name, fn.Namespace)
}

func GroupVersionResource() schema.GroupVersionResource {
	return schema.GroupVersionResource{
		Version:  serverlessv1alpha1.GroupVersion.Version,
		Group:    serverlessv1alpha1.GroupVersion.Group,
		Resource: "functions",
	}
}

func (c Client) CreateFunction(fn serverlessv1alpha1.Function) (*unstructured.Unstructured, error) {

	mapInterfaceFn, err := runtime.DefaultUnstructuredConverter.ToUnstructured(&fn)
	if err != nil {
		return nil, err
	}

	unstructuredFn := &unstructured.Unstructured{
		Object: mapInterfaceFn,
	}

	result, err := c.client.Resource(GroupVersionResource()).Namespace(fn.Namespace).Create(context.Background(), unstructuredFn, metav1.CreateOptions{})
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (c Client) DeleteFunction(name, namespace string) error {
	deletePolicy := metav1.DeletePropagationForeground
	deleteOptions := metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,
	}
	if err := c.client.Resource(GroupVersionResource()).Namespace(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
		return err
	}

	return nil
}

func (c Client) List(namespace string) (*serverlessv1alpha1.FunctionList, error) {
	functionUnstructured, err := c.client.Resource(GroupVersionResource()).Namespace(namespace).List(
		context.Background(), metav1.ListOptions{})

	if err != nil {
		return nil, err
	}
	return toFunctionList(functionUnstructured)
}

func (c Client) MarshaledTinyFunctionList(namespace string) ([]byte, error) {
	functionUnstructured, err := c.List(namespace)
	if err != nil {
		return nil, err
	}

	var tinyFns = []TinyFunction{}
	for _, fn := range functionUnstructured.Items {
		tinyFns = append(tinyFns, TinyFunction{
			Name:      fn.Name,
			Namespace: fn.Namespace,
			Source:    fn.Spec.Source,
		})
	}
	return json.Marshal(tinyFns)
}

type TinyFunction struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
	Source    string `json:"Source"`
}

func (c Client) GetFunctionLogs(name, namespace string, k8sConfig *rest.Config) (map[string]string, error) {
	var logsData = make(map[string]string)

	// creates the clientset
	clientset, err := kubernetes.NewForConfig(k8sConfig)
	if err != nil {
		return logsData, err
	}

	// get the pods by label filter
	labelSelector := metav1.LabelSelector{
		MatchLabels: map[string]string{
			"serverless.kyma-project.io/function-name": name,
			"serverless.kyma-project.io/resource": "deployment",
			},
		}
	listOptions := metav1.ListOptions{
		LabelSelector: labels.Set(labelSelector.MatchLabels).String(),
	}
	podList, err := clientset.CoreV1().Pods(namespace).List(context.Background(), listOptions)
	if err != nil {
		return logsData, err
	}

	// Fetch logs for each pod
	for _, pod := range podList.Items {
		podName := pod.ObjectMeta.Name
		podLogs, err := c.GetPodLogs(podName, namespace, k8sConfig)
		if err != nil {
			return logsData, err
		}
		logsData[podName] = podLogs
	}

	return logsData, nil
}

func (c Client) GetPodLogs(name, namespace string, k8sConfig *rest.Config) (string, error) {

	// creates the clientset
	clientset, err := kubernetes.NewForConfig(k8sConfig)
	if err != nil {
		return "", err
	}

	count := int64(300)
	podLogOpts := v1.PodLogOptions{
		Container: "function",
		Follow:    false,
		TailLines: &count,
	}

	req := clientset.CoreV1().Pods(namespace).GetLogs(name, &podLogOpts)
	podLogs, err := req.Stream(context.Background())
	if err != nil {
		return "", err
	}
	defer podLogs.Close()

	buf := new(bytes.Buffer)
	_, err = io.Copy(buf, podLogs)
	if err != nil {
		return "", err
	}
	str := buf.String()

	return str, nil
}


func toFunctionList(unstructuredList *unstructured.UnstructuredList) (*serverlessv1alpha1.FunctionList, error) {
	functionList := new(serverlessv1alpha1.FunctionList)
	functionListBytes, err := unstructuredList.MarshalJSON()
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(functionListBytes, functionList)
	if err != nil {
		return nil, err
	}
	return functionList, nil
}
