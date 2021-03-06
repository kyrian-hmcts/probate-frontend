const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/executors/alias.json');
const content = require('app/resources/en/translation/executors/alias');

module.exports = class ExecutorsAlias extends ValidationStep {

    static getUrl() {
        return '/executors-alias';
    }

    pruneFormData(ctx) {
        if (ctx.list && ctx.alias === content.optionNo) {
            const list = ctx.list.map(executor => {
                if (executor.hasOtherName) {
                    executor.hasOtherName = false;
                    delete executor.currentName;
                }
                return executor;
            });
            return Object.assign(ctx, {list});
        }
        return ctx;
    }

    * handlePost(ctx, errors) {
        ctx = this.pruneFormData(ctx);
        return [ctx, errors];
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'alias', value: json.optionYes, choice: 'withAlias'}
            ]
        };
        return nextStepOptions;
    }

};
