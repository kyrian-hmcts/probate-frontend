'use strict';

const utils = require('app/components/api-utils'),
    config = require('app/config'),
    submitData = require('app/components/submit-data'),
    paymentData = require('app/components/payment-data'),
    otp = require('otp'),
    {URLSearchParams, parse} = require('url');

const IDAM_SERVICE_URL = config.services.idam.apiUrl;
const VALIDATION_SERVICE_URL = config.services.validation.url;
const SUBMIT_SERVICE_URL = config.services.submit.url;
const POSTCODE_SERVICE_URL = config.services.postcode.url;
const PERSISTENCE_SERVICE_URL = config.services.persistence.url;
const CREATE_PAYMENT_SERVICE_URL = config.services.payment.createPaymentUrl;
const TOKEN = config.services.postcode.token;
const PROXY = config.services.proxy;
const SERVICE_AUTHORISATION_URL = config.services.idam.s2s_url + '/lease';
const serviceName = config.services.idam.service_name;
const secret = config.services.idam.service_key;
const logger = require('app/components/logger')('Init');

const getUserDetails = function (securityCookie) {
    logger.info('getUserDetails');
    const url = `${IDAM_SERVICE_URL}/details`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${securityCookie}`
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    return utils.fetchJson(url, fetchOptions);
};

const findAddress = function (postcode) {
    logger.info('findAddress');
    const url = `${POSTCODE_SERVICE_URL}?postcode=${encodeURIComponent(postcode)}`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${TOKEN}`
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers, PROXY);
    return utils.fetchJson(url, fetchOptions);
};

const validateFormData = function (data, sessionID) {
    logger.info('validateFormData');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': sessionID
    };
    const fetchOptions = utils.fetchOptions({formdata: data}, 'POST', headers);
    return utils.fetchJson(`${VALIDATION_SERVICE_URL}`, fetchOptions);
};

const submitApplication = function (data, ctx, softStop) {
    logger.info('submitApplication');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': ctx.sessionID,
        'Authorization': ctx.authToken,
        'UserId': ctx.userId
    };
    const body = submitData(ctx, data);
    body.softStop = softStop;
    body.applicantEmail = data.applicantEmail;
    const fetchOptions = utils.fetchOptions({submitdata: body}, 'POST', headers);
    return utils.fetchJson(`${SUBMIT_SERVICE_URL}`, fetchOptions);
};

const loadFormData = function (id, sessionID) {
    logger.info('loadFormData');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': sessionID
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    return utils.fetchJson(`${PERSISTENCE_SERVICE_URL}/${id}`, fetchOptions);
};

const saveFormData = function (id, data, sessionID) {
    logger.info('saveFormData');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': sessionID
    };
    const body = {
        id: id,
        formdata: data,
        submissionReference: data.submissionReference
    };
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchJson(`${PERSISTENCE_SERVICE_URL}`, fetchOptions);
};

const createPayment = function (data) {
    logger.info('createPayment');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': data.authToken,
        'ServiceAuthorization': data.serviceAuthToken
    };
    const body = paymentData.createPaymentData(data);
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    const createPaymentUrl = CREATE_PAYMENT_SERVICE_URL.replace('userId', data.userId);
    return [utils.fetchJson(createPaymentUrl, fetchOptions), body.reference];
};

const findPayment = function (data) {
    logger.info('findPayment');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': data.authToken,
        'ServiceAuthorization': data.serviceAuthToken
    };

    const fetchOptions = utils.fetchOptions(data, 'GET', headers);
    const findPaymentUrl = CREATE_PAYMENT_SERVICE_URL.replace('userId', data.userId) + '/' + data.paymentId;
    return utils.fetchJson(findPaymentUrl, fetchOptions);
};

const findInviteLink = function (inviteId) {
    logger.info('find invite link');
    const fetchOptions = utils.fetchOptions({}, 'GET', {});
    const findInviteHost = parse(PERSISTENCE_SERVICE_URL);
    const findInviteLinkUrl = `${findInviteHost.protocol}//${findInviteHost.hostname}:${findInviteHost.port}/invitedata/${inviteId}`;
    return utils.fetchJson(findInviteLinkUrl, fetchOptions);
};

const updateInviteData = function (inviteId, data) {
    logger.info('update invite');
    const headers = {
        'Content-Type': 'application/json'
    };
    const fetchOptions = utils.fetchOptions(data, 'PATCH', headers);
    const findInviteHost = parse(PERSISTENCE_SERVICE_URL);
    const findInviteLinkUrl = `${findInviteHost.protocol}//${findInviteHost.hostname}:${findInviteHost.port}/invitedata/${inviteId}`;
    return utils.fetchJson(findInviteLinkUrl, fetchOptions);
};

const sendInvite = function (data, sessionID) {
    logger.info('send invite');
    const headers = {'Content-Type': 'application/json', 'Session-Id': sessionID};
    const fetchOptions = utils.fetchOptions(data, 'POST', headers);
    const sendInviteHost = parse(VALIDATION_SERVICE_URL);
    const sendInviteUrl = `${sendInviteHost.protocol}//${sendInviteHost.hostname}:${sendInviteHost.port}/invite`;
    return utils.fetchText(sendInviteUrl, fetchOptions);
};

const checkAllAgreed = function (formdataId) {
    logger.info('check all agreed');
    const fetchOptions = utils.fetchOptions({}, 'GET', {});
    const allAgreedHost = parse(VALIDATION_SERVICE_URL);
    const allAgreedUrl = `${allAgreedHost.protocol}//${allAgreedHost.hostname}:${allAgreedHost.port}/invites/allAgreed/${formdataId}`;
    return utils.fetchText(allAgreedUrl, fetchOptions);
};

const sendPin = function (phoneNumber, sessionID) {
    logger.info('send pin');
    const fetchOptions = utils.fetchOptions({}, 'GET', {'Content-Type': 'application/json', 'Session-Id': sessionID});
    const pinServiceHost = parse(VALIDATION_SERVICE_URL);
    const pinServiceUrl = `${pinServiceHost.protocol}//${pinServiceHost.hostname}:${pinServiceHost.port}/pin/${phoneNumber}`;
    return utils.fetchJson(pinServiceUrl, fetchOptions);
};

const authorise = function () {
    logger.info('authorise');
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const oneTimePassword = otp ({secret: secret}).totp();
    const params = new URLSearchParams();
    params.append('microservice', serviceName);
    params.append('oneTimePassword', oneTimePassword);
    const fetchOptions = utils.fetchOptions(params, 'POST', headers);
    return utils.fetchText(`${SERVICE_AUTHORISATION_URL}`, {method: 'POST', body: params, headers: fetchOptions.headers});
};

const getOauth2Token = function (code, redirectUri) {
    logger.info(`calling oauth2 token, proxy url: ${PROXY}`);
    const clientName = config.services.idam.probate_oauth2_client;
    const secret = config.services.idam.probate_oauth2_secret;
    const idam_api_url = config.services.idam.apiUrl;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + new Buffer(`${clientName}:${secret}`).toString('base64')
    };

    const params = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
    };

    logger.info(`params : ${params}`);
    logger.info(`json params : ${JSON.stringify(params)}`);

    const fetchOptions = utils.fetchOptions(params, 'POST', headers, PROXY);
    return utils.fetchJson(`${idam_api_url}/oauth2/token`, fetchOptions);
};

const updatePhoneNumber = function (inviteId, data) {
    logger.info('Update Phone Number');
    const headers = {
        'Content-Type': 'application/json'
    };
    const fetchOptions = utils.fetchOptions(data, 'PATCH', headers);
    const findInviteHost = parse(PERSISTENCE_SERVICE_URL);
    const findInviteUrl = `${findInviteHost.protocol}//${findInviteHost.hostname}:${findInviteHost.port}/invitedata/${inviteId}`;
    return utils.fetchJson(findInviteUrl, fetchOptions);
};

module.exports = {
    getUserDetails,
    findAddress,
    validateFormData,
    submitApplication,
    loadFormData,
    saveFormData,
    createPayment,
    findPayment,
    findInviteLink,
    updateInviteData,
    authorise,
    getOauth2Token,
    sendPin,
    sendInvite,
    updatePhoneNumber,
    checkAllAgreed
};
