Ext.Loader.syncRequire(['CGP.common.commoncomp.overridesubmit', 'Ext.ux.form.field.TriggerField', 'Ext.ux.form.field.FileField']);
Ext.define('CGP.common.commoncomp.UploadPanel', {
    extend:'Ext.form.Panel',
    alias: ['widget.uploadpanel'],
    width: '100%',
    autoScroll: false,
    border: false,
    layout:{
        type: 'table',
        columns: 2
    },
    multiSelect:false,
    url:composingPath + 'api/templates/upload?type=PAGE',
    fnSuccess:null,
    formFileName: 'files',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'uxfilefield',
                itemId: 'files',
                name: me.formFileName,
                buttonText: '选择',
                fieldLabel: '文件',
                buttonConfig: {
                    width: 70
                },
                width: 580,
                height: 130,
                allowBlank: false
            },
            {
                xtype: 'button',
                text: i18n.getKey('upload'),
                width: 70,
                style : {
                    marginTop: '-5px',
                    marginLeft : '5px'
                },
                minWidth : 60,
                handler: function (btn) {
                    var form = btn.up('form').getForm();
                    if (form.isValid()) {
                        form.submit({
                            url: me.url,
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: me.fnSuccess||function (fp, action) {
                                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('文件上传成功') + "!");
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('文件上传失败') + "!");
                            }
                        });
                    }
                }
            }
        ];
        me.callParent(arguments);
    }
})