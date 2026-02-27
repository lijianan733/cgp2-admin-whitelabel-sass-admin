/**
 *详细页
 **/
Ext.Loader.syncRequire(["CGP.buildermanage.model.ConfigModel"]);
Ext.define('CGP.buildermanage.edit', {
    extend: 'Ext.panel.Panel',


    layout: {
        type: 'vbox',
        align: 'left'
    },

    autoScroll: true,

    defaults: {
        width: '100%'
    },
    /*overflowX: 'hidden',
     overflowY: 'auto',*/

    /*bodyStyle: {
     padding: '10px'
     },*/
    bodyPadding: '0 10 20 10',
    /*bodyStyle :'overflow: hidden;',*/
    //padding: '0 10 0 10',
    initComponent: function () {

        var me = this;
        var configModel = null;
        var configModelId = JSGetQueryString('recordId');
        var controller = Ext.create('CGP.buildermanage.controller.Controller');
        var editOrNew = JSGetQueryString('editOrNew');
        if(!Ext.isEmpty(configModelId)){
            configModel = Ext.ModelManager.getModel("CGP.buildermanage.model.ConfigModel");
        }

        /*me.tbar = [{
         xtype: 'displayfield',
         fieldLabel: false,
         value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('linkman') + '</font>'
         },{
         xtype: 'button',
         text: i18n.getKey('edit'),
         action: 'edit'
         }];*/
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                style: 'background-color:white;',
                color: 'black',
                bodyStyle: 'border-color:white;',
                border: '0 0 0 0',
                items: [
                    {
                        xtype: 'button',
                        margin: '0 0 0 10',
                        itemId: 'button',
                        text: i18n.getKey('save'),
                        iconCls: 'icon_save',
                        handler: function () {
                            var data = me.form.getValue();
                            var versionConfigs = me.getComponent('configVersionGrid').getValue();
                            controller.saveConfig(data,versionConfigs,configModelId,editOrNew,me);
                        }
                    }
                ]

            }
        ];
        me.items = [
            Ext.create('CGP.buildermanage.view.BaseInfo'),
            Ext.create('CGP.buildermanage.view.ConfigVersionGrid',{
                configModelId: configModelId,
                editOrNew: editOrNew,
                itemId: 'configVersionGrid',
                configModel: configModel
            })
            /*,
            {//收件人信息
                xtype: 'detailsdelivery',
                height: 220
            }*/
        ];
        me.listeners = {
            render: function () {
                var me = this;
                if (!Ext.isEmpty(configModelId)) {
                    configModel.load(Number(configModelId), {
                        success: function (record, operation) {
                            configModel = record;
                            var form = me.down('form');
                            Ext.Array.each(form.items.items, function (item) {
                                item.setValue(record.data[item.name]);
                            });
                        }
                    });
                }
            }

        }
        me.callParent(arguments);
        me.form = me.down('form');


    },
    setValue: function (order) {
        var me = this;
        me.order = order;
        me.items.each(function (item) {
            if (item.setValue) {
                item.setValue(order);
            }
        });
        var toolbar = me.down('toolbar');
        var status = order.get("status");
        var statusName = i18n.getKey(status.name);
        var statusId = status.id;
        var isRedo = order.get('isRedo');


    }


});