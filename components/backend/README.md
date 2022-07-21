# Backend

## REST APIs

```
Hostname: <hostname>

Set KubeConfig: POST /api/kubeconfig/{name}
    Request Body: 
       - Header: Content-Type: application/json
       - Body: <KubeConfig-Contents>

Get All Subscriptions: GET /api/subs
    Query Param: ns=<namespace>   (use ?ns=-A to get subscriptions from all namespaces)
    
Get All cleaned event types: GET /api/cleaneventtypes
    Query Param: ns=<namespace>   (use ?ns=-A to get from all namespaces)

Get Subscription: GET /api/{ns}/subs/{name}
Delete Subscription: DELETE /api/{ns}/subs/{name}
Create Subscription: POST /api/{ns}/subs/{name}
    Request Body: 
       - Header: 
       - Body: 
            {
                "sink": "http://test.tunas-testing.svc.cluster.local",
                "appName": "noapp"
                "eventName": "order.created"
                "eventVersion": "v1"
            }
Update Subscription: PUT /api/{ns}/subs/{name}
    Request Body: 
       - Header: Content-Type: application/json
       - Body: 
            {
                "sink": "http://test.tunas-testing.svc.cluster.local",
                "appName": "noapp"
                "eventName": "order.created"
                "eventVersion": "v1"
            }

```
