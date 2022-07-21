package function

import (
	"context"
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
	subscriptionUnstructured, err := c.client.Resource(GroupVersionResource()).Namespace(namespace).Get(
		context.Background(), name, metav1.GetOptions{})

	if err != nil {
		return nil, err
	}
	return subscriptionUnstructured, nil
}

func (c Client) UpdateFunction(fn serverlessv1alpha1.Function) (*unstructured.Unstructured, error) {

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
}

func GroupVersionResource() schema.GroupVersionResource {
	return schema.GroupVersionResource{
		Version:  serverlessv1alpha1.GroupVersion.Version,
		Group:    serverlessv1alpha1.GroupVersion.Group,
		Resource: "function",
	}
}
