Ext.define('CGP.dsrequesttemplate.view.editJson', {
    extend: 'Ext.window.Window',

    modal: true,
    autoShow: true,
    layout: 'fit',
    maximizable: true,
    itemId: "showJsonData",
    alias: 'requestTemplateInfo',

    initComponent: function () {
        var me = this;
        var previewData;
        me.title = i18n.getKey(me.createOrEdit);
        if (Ext.isEmpty(me.requestTemplateModel)) {
            previewData = {};
        } else {
            previewData = me.requestTemplateModel.data;
        }
        var valueString = JSON.stringify(previewData, null, "\t");
        var controller = Ext.create('CGP.dsrequesttemplate.controller.Controller');
        me.bbar = [
            '->',
            {
                itemId: 'btnSave',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (comp) {
                    var jsonData;
                    var jsonArea = me.getComponent('jsonArea');
                    var data = jsonArea.getValue();
                    var mask = me.setLoading();
                    if (!Ext.isEmpty(data)) {
                        try {
                            jsonData = JSON.parse(data);
                        } catch (e) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('illlegal json'));
                            mask.hide();// error in the above string (in this case, yes)!
                            return;
                        }
                    }
                    var controller = Ext.create('CGP.dsrequesttemplate.controller.Controller');
                    controller.addPageTemplateConfigWin(jsonData, me.requestTemplateModel, mask);

                }
            },
            {
                itemId: 'btnCancel',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (comp) {
                    me.close();
                }
            }];
        me.items = [
            {
                xtype: 'textarea',
                fieldLabel: false,
                itemId: 'jsonArea',
                width: 800,
                height: 600,
                value: valueString
            }
        ];
        me.callParent(arguments);
    }
});