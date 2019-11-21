/* *
 * This template is based on the hello world skill provided by ask new.
 * */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = "I am your fairy godmother.  You can say I want to be an animal.";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const InProgressMakeAnimalIntent = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
  
      return request.type === 'IntentRequest'
        && request.intent.name === 'MakeAnimalIntent'
        && request.dialogState !== 'COMPLETED';
    },
    handle(handlerInput) {
      const currentIntent = handlerInput.requestEnvelope.request.intent;
  
      return handlerInput.responseBuilder
        .addDelegateDirective(currentIntent)
        .getResponse();
    }
  };
  
  const CompletedMakeAnimalIntent = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
  
      return request.type === 'IntentRequest'
        && request.intent.name === 'MakeAnimalIntent'
        && request.dialogState === 'COMPLETED';
    },
    handle(handlerInput) {
      
      var er_success = true;
      const SpeechStartText = "Poof! You are an amazing ";
      const color = handlerInput.requestEnvelope.request.intent.slots.color.value + ' ';
      const animal = handlerInput.requestEnvelope.request.intent.slots.animal.value + '!'; 
      const speechText = SpeechStartText + color + animal;
      
      try {
        handlerInput.requestEnvelope.request.intent.slots.color.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        handlerInput.requestEnvelope.request.intent.slots.animal.resolutions.resolutionsPerAuthority[0].values[0].value.name;
      } catch(error) {
          er_success = false;
      }
      
      if (er_success) {
        const erColor = handlerInput.requestEnvelope.request.intent.slots.color.resolutions.resolutionsPerAuthority[0].values[0].value.name + ' ';
        const erAnimal = handlerInput.requestEnvelope.request.intent.slots.animal.resolutions.resolutionsPerAuthority[0].values[0].value.name + '!';
        const erSpeechText = SpeechStartText + erColor + erAnimal;
        var speechOutput = "Entity Resolution: " + erSpeechText + ". User words: " + speechText + ".";
      } else {
        speechOutput = "Entity Resolution: No resolutions" + ". User words: " + speechText + ".";
      } 

      return handlerInput.responseBuilder
        .speak(speechOutput)
        .getResponse();
    }
  };


const MakeAnimalIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MakeAnimalIntent';
    },
    handle(handlerInput) {
        const animal = handlerInput.requestEnvelope.request.intent.slots.animal.value;

        const speakOutput = "Poooooof! You are an amazing " + animal + "!";

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
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
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
        const speakOutput = 'An error occurred.';
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
        // MakeAnimalIntentHandler,
        InProgressMakeAnimalIntent,
        CompletedMakeAnimalIntent,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
