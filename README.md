# Webhook Example

This repository is a simple example of how to implement a webhook "receiver". 
It implements pnpm instead of npm, typescript, and is initially implemented without any unit tests.

## Example of functionality

This code sample accepts a simple JSON payload via `PATCH`, `POST`, or `PUT`. 
It will log the payload received to console, and return the result as passed through the template engine to the caller as a response.

Sending a payload of:
```json
{
	"fieldOfAFieldToBeRenamed": "something here",
	"theNameOfAnotherFieldToBeRenamed": 13,
	"imTheSame": true,
	"anotherFieldThatWontBeReturned": "Nope, I wont be returned in the template!"
}
```

Will log the following to console:
```bash
RECEIVED PATCH OR PUT/UPDATE REQUEST WITH BODY OF: {
  fieldOfAFieldToBeRenamed: 'something here',
  theNameOfAnotherFieldToBeRenamed: 13,
  imTheSame: true,
  anotherFieldThatWontBeReturned: 'Nope, I wont be returned in the template!'
}
```

And will return the following to the caller (assuming a `POST`, `PATCH` and `PUT` return slightly different responses as their status codes are different upon success):
```json
{
	"status": 201,
	"result": {
		"message": "Input for POST sucessfully received!",
		"result": [
			{
				"fieldToBeCalled": "something here",
				"anotherFieldNamedWhatYouWant": 13,
				"imTheSame": true
			}
		]
	}
}
```

## Example of Templating Engine

This code sample includes a rudimentary templating engine allowing output to be returned as a json object with custom transformation and mappings as desired. Within the template, you define the structure you want as the output, and the value of each element is what to transform ***from***. The value of the element can be either a static value or a templated field from the original input.
Static values can be one of: `string`, `number`, `boolean`, `null`, `object` with additional structures, or a `function` which can return any of the types of `string`, `number`, `boolean`, `null,` `object`, or `array`.

> `Promises` and `Observables` are not currently supported as static mappings.

Templated fields must be defined by bracketed `{}` field names surrounded by single quotes `''`. e.g. `'{originalElementName}'`.

> `Arrays` and `Objects` within the input object are not currently supported as they are not traversed. Current behavior will simply place the `Array` or `Object` in the spot in which it is defined within the template with no deeper mapping in the elements.

Given a **template** of the following:
```typescript
export const getTemplate: any = {
    fieldToBeCalled: '{fieldOfAFieldToBeRenamed}',
    anotherFieldNamedWhatYouWant: '{theNameOfAnotherFieldToBeRenamed}',
    imTheSame: '{imTheSame}'
};
```

And an **input** of:
```json
{
	"fieldOfAFieldToBeRenamed": "something here",
	"theNameOfAnotherFieldToBeRenamed": 13,
	"imTheSame": true,
	"anotherFieldThatWontBeReturned": "Nope, I wont be returned in the template!"
}
```

Will result in an **output** of the following:
```json
{
    "fieldToBeCalled": "something here",
    "anotherFieldNamedWhatYouWant": 13,
    "imTheSame": true
}
```

## Cloudevents

As of release 0.2.0, this code supports receiving CloudEvents via the official [SDK](https://github.com/cloudevents/sdk-javascript)

A new CloudEvents specific route is provided at `src > common > rest > routes > webhook-example-ce.route.ts`. This route only accepts requests via `POST` as per the CloudEvents specification. 

> While the new route enforces `POST` only, it does not enforce `HTTPS` only, which is also part of the specification. Enforce this via an ingress/load balancer/api gateway if using this code as is.

A new CloudEvents specific service is provided at `src > feature > webhook-example-ce > service.ts` with a single method of `processRequest`. As of now, it only outputs to console as does the previous webhook example.

### Example sender

In order to test sending of a cloud event, you can create a new node project with this in the `main()` method of your `index.ts` to send an event to your server (the code in this repository).

```typescript
import { CloudEvent, HTTP } from 'cloudevents';
import http from 'http';

const ce: CloudEvent<any> = new CloudEvent({
    source: '/source',
    type: 'type',
    datacontenttype: 'text/plain',
    dataschema: 'https://d.schema.com/my.json',
    subject: 'cha.json',
    data: 'blah blah blah',
    extension1: 'some extension data',
});
const message = HTTP.structured(ce);

const req = http.request({
    hostname: 'localhost', 
    port: 8080, 
    path: '/hook-ce', 
    method: 'POST',
    headers: message.headers
}, (res) => {
    res.on('end', () => {
        console.log('Response ended');
    });
});
req.on('error', (error) => {
    console.error(error);
});
req.write(message.body);
req.end();
```