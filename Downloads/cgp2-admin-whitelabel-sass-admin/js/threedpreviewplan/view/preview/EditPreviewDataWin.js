Ext.define('CGP.threedpreviewplan.view.preview.EditPreviewDataWin', {
    extend: 'Ext.window.Window',
    modal: true,
    resizable: false,
    layout: {
        type: 'fit'
    },
    autoShow: true,
    //全局页面的编辑状态
    globalStatus: 'edit',
    autoScroll: true,
    draggable: true,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.threedmodelconfig.controller.Controller');
        me.title = i18n.getKey('edit') + i18n.getKey('camera');
        var form = Ext.create('CGP.threedpreviewplan.view.preview.EditPreviewDataForm', {
            testPlanData: me.testPlanData,
            formData: me.formData,
            previewForm: me.previewForm,
            itemId: 'editConfigForm'
        });
        me.items = [
            form
        ];
        me.bbar = ['->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                itemId: 'saveBtn',
                handler: function (btn) {
                    var data = me.getValue();
                    var form = me.down('form');
                    if (form.isValid()) {
                        me.updateTestPlanData();
                        me.close();
                    }

                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function () {
                    me.close();
                }
            }
        ]
        me.callParent(arguments);
    },

    getValue: function () {
        var me = this;
        var resultData = {};
        var form = me.down('form');
        if (form.isValid()) {
            var items = form.items.items;
            Ext.Array.each(items, function (item) {
                resultData[item.name] = item.getValue();
            });
        }
        return resultData;
    },

    updateTestPlanData: function () {
        var me = this;
        var data = me.getValue();
        me.testPlanData.threeDVariableConfig.camera = data;
        me.testPlanData.threeDVariableConfig.bgColor = data.bgColor;
        delete data.bgColor;
        me.modelInfoForm.setValue(me.testPlanData);
    }
})
