var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { nav } from '../ui';
import { uid } from '../uid';
import { apiTokenApi, callCenterapi, CenterAppApi } from './centerApi';
const debugUnitId = Number(process.env.REACT_APP_DEBUG_UNITID);
const apiTokens = {};
const appsInFrame = {};
export let meInFrame = {
    hash: undefined,
    unit: debugUnitId,
};
window.addEventListener('message', function (evt) {
    return __awaiter(this, void 0, void 0, function* () {
        let e = evt;
        var message = e.data;
        switch (message.type) {
            default: break;
            case 'hide-frame-back':
                hideFrameBack(message.hash);
                break;
            case 'pop-app':
                nav.back();
                break;
            case 'center-api':
                yield callCenterApiFromMessage(e.source, message);
                break;
            case 'center-api-return':
                bridgeCenterApiReturn(message);
                break;
            case 'app-api':
                console.log("receive PostMessage: %s", JSON.stringify(message));
                let ret = yield onReceiveAppApiMessage(message.hash, message.apiOwner, message.apiName);
                e.source.postMessage({
                    type: 'app-api-return',
                    apiOwner: message.apiOwner,
                    apiName: message.apiName,
                    url: ret.url,
                    token: ret.token
                }, "*");
                break;
            case 'app-api-return':
                console.log("app-api-return: %s", JSON.stringify(message));
                onAppApiReturn(message.apiName, message.url, message.token);
                break;
        }
    });
});
function hideFrameBack(hash) {
    console.log('hideFrameBack %s', hash);
    let el = document.getElementById(hash);
    if (el !== undefined)
        el.hidden = true;
}
function onReceiveAppApiMessage(hash, apiOwner, apiName) {
    return __awaiter(this, void 0, void 0, function* () {
        let appInFrame = appsInFrame[hash];
        if (appInFrame === undefined)
            return { name: apiName, url: undefined, token: undefined };
        let { unit } = appInFrame;
        let ret = yield apiTokenApi.api({ unit: unit, apiOwner: apiOwner, apiName: apiName });
        return { name: apiName, url: ret.url, token: ret.token };
    });
}
function onAppApiReturn(apiName, url, token) {
    let action = apiTokens[apiName];
    if (action === undefined) {
        action.reject('error app api return');
        return;
    }
    action.url = url;
    action.token = token;
    action.resolve(action);
}
export function setMeInFrame(appHash) {
    let p0 = 3;
    let p1 = appHash.indexOf('-', p0);
    if (p1 < p0)
        return;
    //let p2 = appHash.indexOf('-', p1+1);
    //if (p2<p1) return;
    meInFrame.hash = appHash.substring(p0, p1);
    meInFrame.unit = Number(appHash.substring(p1 + 1));
    //meInFrame.app = Number(appHash.substring(p2+1));
    return meInFrame;
}
export function appUrl(url, unitId) {
    let u;
    for (;;) {
        u = uid();
        let a = appsInFrame[u];
        if (a === undefined) {
            appsInFrame[u] = { hash: u, unit: unitId };
            break;
        }
    }
    return { url: url + '#tv' + u + '-' + unitId, hash: u };
}
export function loadAppApis(appOwner, appName) {
    return __awaiter(this, void 0, void 0, function* () {
        let centerAppApi = new CenterAppApi('tv/');
        return yield centerAppApi.apis(debugUnitId, appOwner, appName);
    });
}
export function appApi(api, apiOwner, apiName) {
    return __awaiter(this, void 0, void 0, function* () {
        let apiToken = apiTokens[api];
        if (apiToken !== undefined)
            return apiToken;
        if (window === window.parent) {
            apiToken = yield apiTokenApi.api({ unit: debugUnitId, apiOwner: apiOwner, apiName: apiName });
            apiTokens[api] = apiToken;
            if (apiToken === undefined) {
                let err = 'unauthorized call: apiTokenApi center return undefined!';
                //console.log(err);
                throw err;
            }
            return apiToken;
        }
        console.log("appApi parent send: %s", meInFrame.hash);
        apiToken = {
            name: api,
            url: undefined,
            token: undefined,
            resolve: undefined,
            reject: undefined,
        };
        apiTokens[api] = apiToken;
        return new Promise((resolve, reject) => {
            apiToken.resolve = (at) => __awaiter(this, void 0, void 0, function* () {
                let a = yield at;
                console.log('return from parent window: %s', JSON.stringify(a));
                apiToken.url = a.url;
                apiToken.token = a.token;
                resolve(apiToken);
            });
            apiToken.reject = reject;
            window.parent.postMessage({
                type: 'app-api',
                apiName: api,
                hash: meInFrame.hash,
            }, "*");
        });
        //apiToken = await apiTokenApi.api({dd: 'd'});
        //return apiToken;
    });
}
const brideCenterApis = {};
export function bridgeCenterApi(url, method, body) {
    console.log('bridgeCenterApi: url=%s, method=%s', url, method);
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let callId;
        for (;;) {
            callId = uid();
            let bca = brideCenterApis[callId];
            if (bca === undefined) {
                brideCenterApis[callId] = {
                    id: callId,
                    resolve: resolve,
                    reject: reject,
                };
                break;
            }
        }
        window.parent.postMessage({
            type: 'center-api',
            callId: callId,
            url: url,
            method: method,
            body: body
        }, '*');
    }));
}
function callCenterApiFromMessage(from, message) {
    return __awaiter(this, void 0, void 0, function* () {
        let { callId, url, method, body } = message;
        let result = yield callCenterapi.directCall(url, method, body);
        from.postMessage({
            type: 'center-api-return',
            callId: callId,
            result: result,
        }, '*');
    });
}
function bridgeCenterApiReturn(message) {
    let { callId, result } = message;
    let bca = brideCenterApis[callId];
    if (bca === undefined)
        return;
    brideCenterApis[callId] = undefined;
    bca.resolve(result);
}
//# sourceMappingURL=appBridge.js.map