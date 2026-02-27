/**
 * 重写submit 使用jquery进行图片提交
 */
Ext.define('CGP.product.edit.component.image.Submit', {
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

    uploadByJqueryForm: function (options) {
        var me = this;
        var scope = options.scope;

        $(options.form).ajaxSubmit({
            type: options.method,
            url: options.url,
            success: function (data) {
                options.form.remove();
                //发送成功
                if (options.success) options.success.call(scope || this, data);
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                if (options.failure) options.failure.call(scope || this, textStatus);
            }
        });
        return true;
    }


});