const testConfig = require('test/config.js');

exports.config = {
    'tests': './paths/**/*.js',
    'output': './output',
    'helpers': {
        'Nightmare': {
            'url': testConfig.TestFrontendUrl || 'https://localhost:3000',
            'waitForTimeout': 10000,
            'show': false,
            waitForAction: 2000,
            'switches': {
                'ignore-certificate-errors': true
            }
        },
        'NightmareHelper': {
            'require': './helpers/NightmareHelper.js'
        }
    },
    'include': {
        'I': './pages/steps.js'
    },
    'bootstrap': 'test/service-stubs/persistence',
    'mocha': {
        'reporterOptions': {
            'reportDir': process.env.E2E_OUTPUT_DIR || './output',
            'reportName': 'index',
            'inlineAssets': true
        }
    },
    'name': 'Codecept Tests'
};
