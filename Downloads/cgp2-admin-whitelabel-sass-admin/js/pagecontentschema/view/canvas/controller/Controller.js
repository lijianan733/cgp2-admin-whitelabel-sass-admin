/**
 * Created by nan on 2020/9/1.
 */
Ext.define('CGP.pagecontentschema.view.canvas.controller.Controller', {
    saveCanvas: function (data, pageContentSchemaId, store, tipInfo, form) {
        Ext.Ajax.request({
            url: adminPath + 'api/pageContentSchemas/' + pageContentSchemaId + '/canvases',
            method: 'PUT',
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    var canvasData = responseMessage.data;
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey(tipInfo));
                    store.load();
                    if (form) {
                        var builderConfigTab = window.parent.Ext.getCmp('PCSTab');
                        var canvasEditPage = null;
                        if (builderConfigTab) {
                            builderConfigTab.pageContentSchemaData.canvases = canvasData;
                            canvasEditPage = builderConfigTab.getComponent('canvas_edit');
                        } else {
                            canvasEditPage = top.Ext.getCmp('tabs').getComponent('canvas_edit');
                        }
                        canvasEditPage.setTitle(i18n.getKey('edit') + '_' + i18n.getKey('canvas'));
                        form.createOrEdit = 'edit';
                        form.setLoading(false);
                    }
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    /**
     * 查看rtObject
     * @param data
     */
    checkActionRtObject: function (data) {
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            width: 500,
            maxHeight: 500,
            title: i18n.getKey('rtObject'),
            layout: 'fit',
            items: [
                {
                    xtype: 'rttypetortobjectfieldcontainer',
                    itemId: 'value',
                    name: 'value',
                    allowBlank: false,
                    rtTypeId: null,
                    hidden: false,
                    disabled: false,
                    rtTypeAttributeInputFormConfig: {
                        hideRtType: true,
                    }
                }
            ],
            listeners: {
                afterrender: function () {
                    var me = this;
                    data.rtTypeId = data.rtType._id;
                    me.items.items[0].setValue(data);
                }
            }
        });
        win.show();
    },
    /**
     * 查看可移动区域
     */
    checkAreaShape: function (data) {
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            width: 500,
            maxHeight: 500,
            title: i18n.getKey('可移动区域'),
            layout: 'fit',
            items: [
                {
                    xtype: 'shapeconfigfieldset',
                    name: 'clipPath',
                    readOnly: true,
                    itemId: 'clipPath',
                    legendItemConfig: {
                        disabledBtn: {
                            isUsable: true,
                            hidden: true,
                            disabled: true,
                        }
                    }
                }],
        });
        win.show();
        win.items.items[0].diySetValue(data)


    },
    /**
     *自由元素约束
     */
    addFreeElementConstraint: function (constraints) {
        constraints.add({
            xtype: 'constraintfieldset',
            data: CGP.pagecontentschema.view.canvas.config.Config.constraint3,
        });
        constraints.add({
            xtype: 'constraintfieldset',
            data: CGP.pagecontentschema.view.canvas.config.Config.constraint4,
        });
        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('addsuccessful'));

    },
    /**
     * 添加单图多文本约束
     * @param constraints
     */
    addMultiTextAndSingleImageConstraint: function (constraints) {
        constraints.add({
            xtype: 'constraintfieldset',
            data: CGP.pagecontentschema.view.canvas.config.Config.constraint1,
        });
        constraints.add({
            xtype: 'constraintfieldset',
            data: CGP.pagecontentschema.view.canvas.config.Config.constraint2,
        });
        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('addsuccessful'));
    }
})
