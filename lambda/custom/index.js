/* *
 * This is a template for starting the HOLs.
 * */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const vets = { "dog": "Dr. Kay Nine", "cat": "Dr. Fee Line" }
        handlerInput.attributesManager.setSessionAttributes(vets); 

        const speakOutput = "Exclusive Veterinary Services welcomes you. You can say I want to register my pet.";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withSimpleCard('Exclusive Vet Services', 'We are here for your fur-baby.')
            .getResponse();
    }
};

const ExclusiveVetIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'WelcomeExclusiveVetIntent';
    },
    handle(handlerInput) {
        const speakOutput = "Hello Exclusive Veterinary Services staff.  I look forward to helping you serve your customers' needs.";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const RegisterPetIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterPetIntent';
    },
    handle(handlerInput) {
        pet_type = handlerInput.requestEnvelope.request.intent.slots.pet_type.value
        pet_name = handlerInput.requestEnvelope.request.intent.slots.pet_name.value
        const speakOutput = "We are happy to welcome your " + pet_type + ' ' + pet_name + "!";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const InProgressRegisterPetIntentHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
  
      return request.type === 'IntentRequest'
        && request.intent.name === 'RegisterPetIntent'
        && request.dialogState !== 'COMPLETED';
    },
    handle(handlerInput) {
      const currentIntent = handlerInput.requestEnvelope.request.intent;
  
      return handlerInput.responseBuilder
        .addDelegateDirective(currentIntent)
        .getResponse();
    }
};
  
const CompletedRegisterPetIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
  
      return request.type === 'IntentRequest'
        && request.intent.name === 'RegisterPetIntent'
        && request.dialogState === 'COMPLETED';
    },
    handle(handlerInput) {

        // Session attributes
        const vets = handlerInput.attributesManager.getSessionAttributes();
        // Slot values
        pet_type = handlerInput.requestEnvelope.request.intent.slots.pet_type.resolutions.resolutionsPerAuthority[0].values[0].value.name
        pet_name = handlerInput.requestEnvelope.request.intent.slots.pet_name.value
        pet_breed = handlerInput.requestEnvelope.request.intent.slots.pet_type.value

        const speechOutput1 = "We are happy to welcome your " + pet_breed + ". Your " + pet_type + " named " + pet_name + " is registered! ";
        const speechOutput2 = pet_name + "'s veterinarian is " + (pet_type === "dog" ? vets.dog : vets.cat) + ".";
        const speakOutput = speechOutput1 + speechOutput2

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = "";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = "";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = "";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = "Danger Will Robinson!";
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ExclusiveVetIntentHandler,
        //RegisterPetIntentHandler,
        InProgressRegisterPetIntentHandler,
        CompletedRegisterPetIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
