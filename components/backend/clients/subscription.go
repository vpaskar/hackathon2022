package subscription

import (
	"context"
	"encoding/json"
	"k8s.io/client-go/util/retry"
	"log"

	eventingv1alpha1 "github.com/kyma-project/kyma/components/eventing-controller/api/v1alpha1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/dynamic"
)

// Client struct for Kyma Subscription client
type Client struct {
	client dynamic.Interface
}

// NewClient creates and returns new client for Kyma Subscriptions
func NewClient(client dynamic.Interface) Client {
	return Client{client}
}

// List returns the list of kyma subscriptions in specified namespace
// or returns an error if it fails for any reason
func (c Client) List(namespace string) (*eventingv1alpha1.SubscriptionList, error) {

	subscriptionsUnstructured, err := c.client.Resource(GroupVersionResource()).Namespace(namespace).List(
		context.Background(), metav1.ListOptions{})

	if err != nil {
		return nil, err
	}
	return toSubscriptionList(subscriptionsUnstructured)
}

// ListJson returns the list of kyma subscriptions in specified namespace as JSON
// or returns an error if it fails for any reason
func (c Client) ListJson(namespace string) (*unstructured.UnstructuredList, error) {

	subscriptionsUnstructured, err := c.client.Resource(GroupVersionResource()).Namespace(namespace).List(
		context.Background(), metav1.ListOptions{})

	if err != nil {
		return nil, err
	}
	return subscriptionsUnstructured, nil
}

// GetSubJson returns the kyma subscription in specified namespace as JSON
// or returns an error if it fails for any reason
func (c Client) GetSubJson(name, namespace string) (*unstructured.Unstructured, error) {

	subscriptionUnstructured, err := c.client.Resource(GroupVersionResource()).Namespace(namespace).Get(
		context.Background(), name, metav1.GetOptions{})

	if err != nil {
		return nil, err
	}
	return subscriptionUnstructured, nil
}

//// GetSub returns the kyma subscription in specified namespace
//// or returns an error if it fails for any reason
//func (c Client) GetSub(name, namespace string) (*eventingv1alpha1.Subscription, error) {
//
//	subscriptionUnstructured, err := c.GetSubJson(name, namespace)
//	if err != nil {
//		return nil, err
//	}
//
//	return subscriptionUnstructured, nil
//}

// CreateSubscription creates a new kyma subscriptions in specified namespace
// or returns an error if it fails for any reason
func (c Client) CreateSubscription(sub eventingv1alpha1.Subscription) (*unstructured.Unstructured, error) {

	mapInterfaceSub, err := runtime.DefaultUnstructuredConverter.ToUnstructured(&sub)
	if err != nil {
		return nil, err
	}

	unstructuredSub := &unstructured.Unstructured{
		Object: mapInterfaceSub,
	}

	result, err := c.client.Resource(GroupVersionResource()).Namespace(sub.Namespace).Create(context.Background(), unstructuredSub, metav1.CreateOptions{})
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UpdateSubscription updates an existing kyma subscriptions in specified namespace
// or returns an error if it fails for any reason
func (c Client) UpdateSubscription(sub eventingv1alpha1.Subscription) (*unstructured.Unstructured, error) {

	mapInterfaceSub, err := runtime.DefaultUnstructuredConverter.ToUnstructured(&sub)
	if err != nil {
		return nil, err
	}

	retryErr := retry.RetryOnConflict(retry.DefaultRetry, func() error {
		// Retrieve the latest version of Deployment before attempting update
		// RetryOnConflict uses exponential backoff to avoid exhausting the apiserver
		result, getErr := c.GetSubJson(sub.Name, sub.Namespace)
		if getErr != nil {
			log.Printf("failed to get latest version of subscription: %v", getErr)
			return err
		}

		if err := unstructured.SetNestedField(result.Object, mapInterfaceSub["spec"], "spec"); err != nil {
			return err
		}

		_, updateErr := c.client.Resource(GroupVersionResource()).Namespace(sub.Namespace).Update(context.Background(), result, metav1.UpdateOptions{})
		return updateErr
	})

	if retryErr != nil {
		return nil, err
	}

	return c.GetSubJson(sub.Name, sub.Namespace)
}

// DeleteSubscription deletes the kyma subscription in specified namespace
// or returns an error if it fails for any reason
func (c Client) DeleteSubscription(name, namespace string) error {

	deletePolicy := metav1.DeletePropagationForeground
	deleteOptions := metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,
	}
	if err := c.client.Resource(GroupVersionResource()).Namespace(namespace).Delete(context.TODO(), name, deleteOptions); err != nil {
		return err
	}

	return nil
}


// GroupVersionResource returns the GVR for Subscription resource
func GroupVersionResource() schema.GroupVersionResource {
	return schema.GroupVersionResource{
		Version:  eventingv1alpha1.GroupVersion.Version,
		Group:    eventingv1alpha1.GroupVersion.Group,
		Resource: "subscriptions",
	}
}

// toSecretList converts unstructured Subscription list object to typed object
func toSubscriptionList(unstructuredList *unstructured.UnstructuredList) (*eventingv1alpha1.SubscriptionList, error) {
	subscriptionList := new(eventingv1alpha1.SubscriptionList)
	subscriptionListBytes, err := unstructuredList.MarshalJSON()
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(subscriptionListBytes, subscriptionList)
	if err != nil {
		return nil, err
	}
	return subscriptionList, nil
}
