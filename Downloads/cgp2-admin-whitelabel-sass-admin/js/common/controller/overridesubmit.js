Ext.define('CGP.common.controller.overridesubmit', {
    override: 'Ext.form.action.Submit',
    doSubmit: function () {
        var me = this,
            ajaxOptions = Ext.apply(me.createCallback(), {
                url: me.getUrl(),
                method: me.getMethod(),
                headers: me.headers
            }),
            form = me.form,
            jsonSubmit = me.jsonSubmit || form.jsonSubmit,
            paramsProp = jsonSubmit ? 'jsonData' : 'params',
            formEl, formInfo;


        if (form.hasUpload()) {
            formInfo = me.buildForm();
            ajaxOptions.form = formInfo.formEl;
            ajaxOptions.isUpload = true;
            if (me.uploadByJqueryForm(ajaxOptions)) {
                return;
            }


        } else {
            ajaxOptions[paramsProp] = me.getParams(jsonSubmit);
        }

        Ext.Ajax.request(ajaxOptions);
        if (formInfo) {
            me.cleanup(formInfo);
        }
    },

    uploadByJqueryForm: function (ajaxOptions) {
        var me = this;
        if (Ext.ux.util.uploadByJqueryForm) {
            Ext.ux.util.uploadByJqueryForm(ajaxOptions);
            return true;
        }
        return false;
    }

});
