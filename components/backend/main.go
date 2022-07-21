package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/vladislavpaskar/hackathon2022/components/backend/clients/function"
	"github.com/vladislavpaskar/hackathon2022/components/backend/clients/subscription"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"

	eventingv1alpha1 "github.com/kyma-project/kyma/components/eventing-controller/api/v1alpha1"
	serverlessv1alpha1 "github.com/kyma-project/kyma/components/function-controller/pkg/apis/serverless/v1alpha1"
)

var subscriptionClient subscription.Client

var functionClient function.Client

type SubscriptionData struct {
	Sink  string   `json:"sink"`
	Types []string `json:"types"`
}

type FunctionData struct {
	Runtime string `json:"runtime"`
	//todo
}

func main() {
	var kubeconfig *string
	if home := homedir.HomeDir(); home != "" && false {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "/Users/faizan/kubeconfigs/kubeconfig--kymatunas--fzn-b1.yml", "absolute path to the kubeconfig file")
	}

	flag.Parse()

	k8sConfig, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		log.Fatal(err)
	}

	// Create dynamic client (k8s)
	dynamicClient := dynamic.NewForConfigOrDie(k8sConfig)

	// setup clients
	subscriptionClient = subscription.NewClient(dynamicClient)
	functionClient = function.NewClient(dynamicClient)

	handleRequests()
}

func handleRequests() {
	r := mux.NewRouter().StrictSlash(true)
	r.Use(commonMiddleware)

	r.HandleFunc("api/kubeconfig/set", putKubeconfig).Methods("POST")

	r.HandleFunc("/api/{ns}/subs/{name}", postSub).Methods("POST")
	r.HandleFunc("/api/subs", getAllSubs).Methods("GET")
	r.HandleFunc("/api/{ns}/subs/{name}", getSub).Methods("GET")
	r.HandleFunc("/api/{ns}/subs/{name}", putSub).Methods("PUT")
	r.HandleFunc("/api/{ns}/subs/{name}", delSub).Methods("DELETE")

	r.HandleFunc("/api/{ns}/funcs/{name}", postFuncs).Methods("POST")
	r.HandleFunc("/api/{ns}/funcs/{name}", getFuncs).Methods("GET")
	r.HandleFunc("/api{ns}/funcs/{name}", putFuncs).Methods("PUT")
	r.HandleFunc("/api/{ns}/funcs/{name}", delFuncs).Methods("DELETE")

	log.Printf("Server listening on port 8000 ...")
	log.Fatal(http.ListenAndServe(":8000", r))
}

func commonMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func putKubeconfig(w http.ResponseWriter, r *http.Request) {
	//TODO
}

func getAllSubs(w http.ResponseWriter, r *http.Request) {
	namespace := "default"
	// Fetch namespace info from the query parameters
	v := r.URL.Query()
	if v.Get("ns") == "-A" {
		namespace = ""
	} else if v.Get("ns") != "" {
		namespace = v.Get("ns")
	}

	// Get subscriptions from the k8s cluster
	subsUnstructured, err := subscriptionClient.ListJson(namespace)
	if err != nil {
		log.Printf("%s %s failed: %v", r.Method, r.RequestURI, err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Convert response to bytes
	subsBytes, err := subsUnstructured.MarshalJSON()
	if err != nil {
		log.Printf("%s %s failed to marchal json: %v", r.Method, r.RequestURI, err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Return response to user
	_, err = w.Write(subsBytes)
	if err != nil {
		log.Printf("%s %s failed to write response: %v", r.Method, r.RequestURI, err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
}

func postSub(w http.ResponseWriter, r *http.Request) {
	// Fetch data from URI
	namespace := mux.Vars(r)["ns"]
	name := mux.Vars(r)["name"]

	// Fetch data from request body
	var newSubData SubscriptionData
	err := json.NewDecoder(r.Body).Decode(&newSubData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Initialize a subscription object
	newSub := &eventingv1alpha1.Subscription{
		Spec: eventingv1alpha1.SubscriptionSpec{
			Sink:   newSubData.Sink,
			Filter: &eventingv1alpha1.BEBFilters{},
		},
	}
	newSub.Kind = "Subscription"
	newSub.APIVersion = "eventing.kyma-project.io/v1alpha1"
	newSub.Name = name
	newSub.Namespace = namespace

	for _, eventType := range newSubData.Types {
		eventFilter := &eventingv1alpha1.BEBFilter{
			EventSource: &eventingv1alpha1.Filter{
				Property: "source",
				Type:     "exact",
				Value:    "",
			},
			EventType: &eventingv1alpha1.Filter{
				Property: "type",
				Type:     "exact",
				Value:    eventType,
			},
		}

		newSub.Spec.Filter.Filters = append(newSub.Spec.Filter.Filters, eventFilter)
	}

	// Create subscription on the k8s cluster
	_, err = subscriptionClient.CreateSubscription(*newSub)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func getSub(w http.ResponseWriter, r *http.Request) {
	// Fetch data from URI
	namespace := mux.Vars(r)["ns"]
	name := mux.Vars(r)["name"]

	subUnstructured, err := subscriptionClient.GetSubJson(name, namespace)
	if err != nil {
		log.Printf("%s %s failed: %v", r.Method, r.RequestURI, err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Convert response to bytes
	subsBytes, err := subUnstructured.MarshalJSON()
	if err != nil {
		log.Printf("%s %s failed to marchal json: %v", r.Method, r.RequestURI, err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Return response to user
	_, err = w.Write(subsBytes)
	if err != nil {
		log.Printf("%s %s failed to write response: %v", r.Method, r.RequestURI, err)
	}
}

func putSub(w http.ResponseWriter, r *http.Request) {
	// Fetch data from URI
	name := mux.Vars(r)["name"]
	if name == "" {
		err := missingNameErr("subscription")
		log.Print(err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	namespace := mux.Vars(r)["ns"]
	if namespace == "" {
		namespace = "default"
	}

	// Fetch data from request body
	var newSubData SubscriptionData
	err := json.NewDecoder(r.Body).Decode(&newSubData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Initialize a subscription object
	newSub := &eventingv1alpha1.Subscription{
		Spec: eventingv1alpha1.SubscriptionSpec{
			Sink:   newSubData.Sink,
			Filter: &eventingv1alpha1.BEBFilters{},
		},
	}
	newSub.Kind = "Subscription"
	newSub.APIVersion = "eventing.kyma-project.io/v1alpha1"
	newSub.Name = name
	newSub.Namespace = namespace

	for _, eventType := range newSubData.Types {
		eventFilter := &eventingv1alpha1.BEBFilter{
			EventSource: &eventingv1alpha1.Filter{
				Property: "source",
				Type:     "exact",
				Value:    "",
			},
			EventType: &eventingv1alpha1.Filter{
				Property: "type",
				Type:     "exact",
				Value:    eventType,
			},
		}

		newSub.Spec.Filter.Filters = append(newSub.Spec.Filter.Filters, eventFilter)
	}

	// Create subscription on the k8s cluster
	_, err = subscriptionClient.UpdateSubscription(*newSub)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func delSub(w http.ResponseWriter, r *http.Request) {
	// Fetch data from URI
	namespace := mux.Vars(r)["ns"]
	name := mux.Vars(r)["name"]
	// check
	// Delete subscription
	err := subscriptionClient.DeleteSubscription(name, namespace)
	if err != nil {
		log.Printf("%s %s failed: %v", r.Method, r.RequestURI, err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func postFuncs(w http.ResponseWriter, r *http.Request) {
	name := mux.Vars(r)["name"]
	if name == "" {
		err := missingNameErr("function")
		log.Print(err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	namespace := mux.Vars(r)["ns"]
	if namespace == "" {
		namespace = "default"
	}

	// Fetch data from request body
	var newFunctionData FunctionData
	err := json.NewDecoder(r.Body).Decode(&newFunctionData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// TODO, what fields are needed here?
	// initialize a function object
	var minReplicas int32 = 5
	var maxReplicas int32 = 5
	newFunction := serverlessv1alpha1.Function{
		Spec: serverlessv1alpha1.FunctionSpec{
			MaxReplicas: &minReplicas,
			MinReplicas: &maxReplicas,
		},
	}
	newFunction.Name = name
	newFunction.Namespace = namespace
	newFunction.APIVersion = "serverless.kyma-project.io/v1alpha1"
	newFunction.Kind = "Function"

	_, err = functionClient.UpdateFunction(*newFunction)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
func getFuncs(w http.ResponseWriter, r *http.Request) {

}
func putFuncs(w http.ResponseWriter, r *http.Request) {

}
func delFuncs(w http.ResponseWriter, r *http.Request) {

}

func missingNameErr(object string) error {
	return fmt.Errorf("can't create %s, missing 'name'", object)
}
