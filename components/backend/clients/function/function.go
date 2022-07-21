package function

import (
	"context"
<<<<<<< HEAD
=======
	"encoding/json"
	"log"

>>>>>>> 5ec016f9d6c6dbfea9aefcc0587fac4abab10e7b
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

<<<<<<< HEAD
	//mapInterfaceFn, err := runtime.DefaultUnstructuredConverter.ToUnstructured(&fn)
	//if err != nil {
	//	return nil, err
	//}
	//
	//retryErr := retry.RetryOnConflict(retry.DefaultRetry, func() error {
	//
	//	result, getErr := c.GetFnJson(fn.Name, fn.Namespace)
	//	if getErr != nil {
	//		log.Printf("failed to get latest version of function: %v", getErr)
	//		return err
	//	}
	//
	//})

	return nil, nil
=======
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
>>>>>>> 5ec016f9d6c6dbfea9aefcc0587fac4abab10e7b
}

func GroupVersionResource() schema.GroupVersionResource {
	return schema.GroupVersionResource{
		Version:  serverlessv1alpha1.GroupVersion.Version,
		Group:    serverlessv1alpha1.GroupVersion.Group,
		Resource: "function",
	}
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

func (c Client) ListJson(namespace string) (*unstructured.UnstructuredList, error) {
	functionUnstructured, err := c.client.Resource(GroupVersionResource()).Namespace(namespace).List(
		context.Background(), metav1.ListOptions{})

	if err != nil {
		return nil, err
	}
	return functionUnstructured, nil
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
