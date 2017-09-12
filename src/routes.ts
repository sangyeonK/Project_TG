/* tslint:disable */
import { ValidateParam } from 'tsoa';
import { Controller } from 'tsoa';
import { FriendController } from './controller/friend';
import { LoginController } from './controller/login';
import { MessageController } from './controller/message';
import { UserInfoController } from './controller/userinfo';
import { expressAuthentication } from './authentication';

const models: any = {
    "Friend": {
        properties: {
            "seq": { "required": true, "typeName": "double" },
            "name": { "required": true, "typeName": "string" },
            "picture": { "required": true, "typeName": "string" },
            "profession_code": { "required": true, "typeName": "string" },
            "speciality_code": { "required": true, "typeName": "string" },
            "is_favorite": { "required": true, "typeName": "boolean" },
            "is_new": { "required": true, "typeName": "boolean" },
        },
    },
    "Login": {
        properties: {
            "access_token": { "required": true, "typeName": "string" },
        },
    },
    "RequestLogin": {
        properties: {
            "platform": { "required": true, "typeName": "string" },
            "code": { "required": false, "typeName": "string" },
            "id": { "required": false, "typeName": "string" },
            "password": { "required": false, "typeName": "string" },
        },
    },
    "Message": {
        properties: {
            "seq": { "required": true, "typeName": "double" },
            "sender_name": { "required": true, "typeName": "string" },
            "sender_account_seq": { "required": true, "typeName": "double" },
            "sender_company": { "required": true, "typeName": "string" },
            "sender_picture": { "required": true, "typeName": "string" },
            "sender_profession_code": { "required": true, "typeName": "string" },
            "message": { "required": true, "typeName": "string" },
            "received_timestamp": { "required": true, "typeName": "string" },
            "is_new": { "required": true, "typeName": "boolean" },
            "is_last": { "required": true, "typeName": "boolean" },
        },
    },
    "UserInfoPicture": {
        properties: {
            "id": { "required": true, "typeName": "string" },
            "intro": { "required": true, "typeName": "string" },
        },
    },
    "ResponseUserInfo": {
        properties: {
            "account_seq": { "required": true, "typeName": "double" },
            "name": { "required": false, "typeName": "string" },
            "profession_code": { "required": false, "typeName": "string" },
            "speciality_code": { "required": false, "typeName": "array", "array": { "typeName": "string" } },
            "company": { "required": false, "typeName": "string" },
            "phone": { "required": false, "typeName": "string" },
            "email": { "required": false, "typeName": "string" },
            "area": { "required": false, "typeName": "string" },
            "introduce": { "required": false, "typeName": "string" },
            "experience": { "required": false, "typeName": "string" },
            "picture": { "required": false, "typeName": "UserInfoPicture" },
        },
    },
    "RequestUpdateUserInfo": {
        properties: {
            "professionCode": { "required": false, "typeName": "string" },
            "specialityCode": { "required": false, "typeName": "array", "array": { "typeName": "string" } },
            "company": { "required": false, "typeName": "string" },
            "phone": { "required": false, "typeName": "string" },
            "email": { "required": false, "typeName": "string" },
            "area": { "required": false, "typeName": "string" },
            "introduce": { "required": false, "typeName": "string" },
            "experience": { "required": false, "typeName": "string" },
        },
    },
};

export function RegisterRoutes(app: any) {
    app.get('/api/friend/:accountSeq',
        function(request: any, response: any, next: any) {
            const args = {
                accountSeq: { "in": "path", "name": "accountSeq", "required": true, "typeName": "double" },
                professionCode: { "in": "query", "name": "professionCode", "required": false, "typeName": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new FriendController();


            const promise = controller.getFriends.apply(controller, validatedArgs);
            let statusCode = undefined;
            if (controller instanceof Controller) {
                statusCode = (controller as Controller).getStatus();
            }
            promiseHandler(promise, statusCode, response, next);
        });
    app.post('/api/login',
        function(request: any, response: any, next: any) {
            const args = {
                requestLogin: { "in": "body", "name": "requestLogin", "required": true, "typeName": "RequestLogin" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new LoginController();


            const promise = controller.login.apply(controller, validatedArgs);
            let statusCode = undefined;
            if (controller instanceof Controller) {
                statusCode = (controller as Controller).getStatus();
            }
            promiseHandler(promise, statusCode, response, next);
        });
    app.get('/api/message/:accountSeq',
        function(request: any, response: any, next: any) {
            const args = {
                accountSeq: { "in": "path", "name": "accountSeq", "required": true, "typeName": "double" },
                reqLastSeq: { "in": "query", "name": "lastSeq", "required": false, "typeName": "double" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new MessageController();


            const promise = controller.getMessages.apply(controller, validatedArgs);
            let statusCode = undefined;
            if (controller instanceof Controller) {
                statusCode = (controller as Controller).getStatus();
            }
            promiseHandler(promise, statusCode, response, next);
        });
    app.get('/api/message/:accountSeq/:messageSeq',
        function(request: any, response: any, next: any) {
            const args = {
                accountSeq: { "in": "path", "name": "accountSeq", "required": true, "typeName": "double" },
                messageSeq: { "in": "path", "name": "messageSeq", "required": true, "typeName": "double" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new MessageController();


            const promise = controller.getMessage.apply(controller, validatedArgs);
            let statusCode = undefined;
            if (controller instanceof Controller) {
                statusCode = (controller as Controller).getStatus();
            }
            promiseHandler(promise, statusCode, response, next);
        });
    app.get('/api/userinfo/:accountSeq',
        function(request: any, response: any, next: any) {
            const args = {
                accountSeq: { "in": "path", "name": "accountSeq", "required": true, "typeName": "double" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserInfoController();


            const promise = controller.getUserInfo.apply(controller, validatedArgs);
            let statusCode = undefined;
            if (controller instanceof Controller) {
                statusCode = (controller as Controller).getStatus();
            }
            promiseHandler(promise, statusCode, response, next);
        });
    app.put('/api/userinfo/:accountSeq',
        function(request: any, response: any, next: any) {
            const args = {
                accountSeq: { "in": "path", "name": "accountSeq", "required": true, "typeName": "double" },
                requestUpdateUserInfo: { "in": "body", "name": "requestUpdateUserInfo", "required": true, "typeName": "RequestUpdateUserInfo" },
                request: { "in": "request", "name": "request", "required": true, "typeName": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserInfoController();


            const promise = controller.updateUserInfo.apply(controller, validatedArgs);
            let statusCode = undefined;
            if (controller instanceof Controller) {
                statusCode = (controller as Controller).getStatus();
            }
            promiseHandler(promise, statusCode, response, next);
        });
    app.put('/api/userinfo/picture/:accountSeq',
        function(request: any, response: any, next: any) {
            const args = {
                accountSeq: { "in": "path", "name": "accountSeq", "required": true, "typeName": "double" },
                request: { "in": "request", "name": "request", "required": true, "typeName": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserInfoController();


            const promise = controller.updateUserPicture.apply(controller, validatedArgs);
            let statusCode = undefined;
            if (controller instanceof Controller) {
                statusCode = (controller as Controller).getStatus();
            }
            promiseHandler(promise, statusCode, response, next);
        });


    function promiseHandler(promise: any, statusCode: any, response: any, next: any) {
        return promise
            .then((data: any) => {
                if (data) {
                    response.json(data);
                    response.status(statusCode || 200);
                } else {
                    response.status(statusCode || 204);
                    response.end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        return Object.keys(args).map(key => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return ValidateParam(args[key], request.query[name], models, name)
                case 'path':
                    return ValidateParam(args[key], request.params[name], models, name)
                case 'header':
                    return ValidateParam(args[key], request.header(name), models, name);
                case 'body':
                    return ValidateParam(args[key], request.body, models, name);
                case 'body-prop':
                    return ValidateParam(args[key], request.body[name], models, name);
            }
        });
    }
}
