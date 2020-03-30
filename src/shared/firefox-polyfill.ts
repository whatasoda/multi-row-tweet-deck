import { EXTENSION_ID as key } from './constants';
import { v4 as uuid } from 'uuid';

const VALUE_PLACEHOLDER = Object.create(null);

type PolyfillMassageData = RequestMessage | ResponseMessage | AsyncStartMessage | NackMessage;

interface RequestMessage extends MessageBase {
  type: 'request';
}

interface ResponseMessage extends MessageBase {
  type: 'response';
}

interface AsyncStartMessage extends MessageBase {
  type: 'async-start';
}

interface NackMessage extends MessageBase {
  type: 'nack';
}

interface MessageBase {
  key: string;
  value: any;
  requestId: string;
}

export const initOnContentScript = (handler: (value: any, sendResponse: (value: any) => void) => void | true) => {
  console.log('hekqophkeqop');
  window.addEventListener('message', (event) => {
    const data = filterPolyfillMessage(event);
    if (!data) return;

    if (data.type === 'request') {
      const { requestId } = data;
      const promise = new Promise((resolve, reject) => {
        let whileSync = true;
        let value = VALUE_PLACEHOLDER;
        const result = handler(data.value, (v) => {
          if (whileSync) {
            value = v;
          } else {
            resolve(v);
          }
        });
        whileSync = false;
        if (value !== VALUE_PLACEHOLDER) {
          const response: PolyfillMassageData = { key, type: 'response', value: value, requestId };
          window.postMessage(response, location.origin);
          resolve(VALUE_PLACEHOLDER);
        } else if (result === true) {
          const asyncStart: PolyfillMassageData = { key, type: 'async-start', value: undefined, requestId };
          window.postMessage(asyncStart, location.origin);
        } else {
          reject();
        }
      });

      promise.then(async (value) => {
        if (value === VALUE_PLACEHOLDER) return;
        const response: PolyfillMassageData = { key, type: 'response', value, requestId };
        window.postMessage(response, location.origin);
      });
    }
  });
};

export const sendMessageWithPolyfill = (value: any) => {
  return new Promise((resolve, reject) => {
    const requestId = uuid();
    const listen = (event: WindowEventMap['message']) => {
      const data = filterPolyfillMessage(event);
      if (!data || data.requestId !== requestId) return;
      if (data.type !== 'request') return;

      let waitingForAyncResponse = false;
      const detectResponse = (event: WindowEventMap['message']) => {
        // if the 'req' message is successflly handled in extension-side,
        // 'nack' message is dispatched after 'res' message
        const data = filterPolyfillMessage(event);
        if (!data || data.requestId !== requestId) return;
        if (data.type === 'response') {
          resolve(data.value);
        } else if (data.type === 'async-start') {
          waitingForAyncResponse = true;
          return;
        } else if (data.type === 'nack') {
          if (waitingForAyncResponse) return;
          reject({ message: 'Hogege' });
        }
        window.removeEventListener('message', detectResponse);
      };

      window.addEventListener('message', detectResponse);
      window.removeEventListener('message', listen);
      const nack: PolyfillMassageData = { key, type: 'nack', value: undefined, requestId };
      window.postMessage(nack, location.origin);
    };
    // add latest listener, this listener will be called after call of a listener in extension-side context
    window.addEventListener('message', listen);

    const request: PolyfillMassageData = { key, type: 'request', value, requestId };
    window.postMessage(request, location.origin);
  });
};

const filterPolyfillMessage = ({ data }: Pick<WindowEventMap['message'], 'data'>) => {
  if (typeof data !== 'object' && data === null) return false;
  if ((data as PolyfillMassageData).key !== key) return false;
  return data as PolyfillMassageData;
};
