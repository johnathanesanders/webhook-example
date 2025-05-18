# Webhook Example

This repository is a simple example of how to implement a webhook "receiver". 
It implements pnpm instead of npm, typescript, and is initially implemented without any unit tests.

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