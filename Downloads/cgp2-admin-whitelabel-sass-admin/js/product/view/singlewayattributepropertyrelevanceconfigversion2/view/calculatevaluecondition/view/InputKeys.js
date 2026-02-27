/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.InputKeys", {
    extend: "Ext.ux.form.ErrorStrickForm",
    requires : ["CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.KeyContainer",
        'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.model.ConditionInput'],
    bodyPadding: '10',
    autoScroll: true,
    region: 'center',
    defaults: {
        width: '100%'
    },
    leftAttributes:null,
    //data: null,
    initComponent: function () {
        var me = this;
        var controller=Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.Controller');
        var conditionInputModel=Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.model.ConditionInput');
        var conditionStore=Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.store.ConditionInput',
            {
                listeners: {
                    datachanged: function (store) {
                        if (!me.getComponent('inputKeys').isDisabled()&&store.count() > 0){
                            me.getComponent('inputKeys').setDisabled(store.count() > 0);
                        }
                        else if (me.getComponent('inputKeys').isDisabled()&&store.count() == 0){
                            me.getComponent('inputKeys').setDisabled(store.count() > 0);
                        }
                    }
                }
            });
        me.items=[
            {
                xtype:'keysform',
                name:'inputKeys',
                itemId:'inputKeys'
            },
            {
                xtype:'gridfield',
                name:'conditionInputs',
                itemId:'conditionInputs',
                gridConfig:{
                    renderTo:'valueConditionGrid',
                    store: conditionStore,
                    maxHeight: 300,
                    tbar: [
//                        '->',
                        {
                            text: i18n.getKey('add'),
                            iconCls: 'icon_add',
                            handler: function (comp) {
                                var currGrid=comp.ownerCt.ownerCt;
                                var inputKeysField=me.getComponent('inputKeys');
                                var conditionInputData={
                                    inputs:[],
                                    condition:null,
                                    description:'',
                                    isAdd:true
                                };
                                if(inputKeysField.isValid()){
                                    var emptyInputs=Ext.Array.map(inputKeysField.getValue(),function(item){
                                        return {"name":item.name};
                                    });
                                    conditionInputData.inputs=emptyInputs;
                                }
                                else{
                                    return false;
                                }
                                if(conditionInputData.inputs.length==0){
                                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('必须添加自定义属性'));
                                    return false;
                                }
                                conditionInputModel.data=conditionInputData;
                                controller.valueConditionWind(currGrid,conditionInputModel,me.leftAttributes);
                            }
                        }
                    ],
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            xtype: 'actioncolumn',
                            itemId: 'actioncolumn',
                            dataIndex:'inputKeys',
                            width: 60,
                            sortable: false,
                            resizable: false,
                            menuDisabled: true,
                            items: [

                                {
                                    iconCls: 'icon_remove icon_margin',
                                    itemId: 'actionremove',
                                    tooltip: 'Remove',
                                    handler: function (view, rowIndex, colIndex) {
                                        Ext.Msg.confirm(i18n.getKey('info'),i18n.getKey('deleteConfirm'), function (select) {
                                            if (select == 'yes') {
                                                var store = view.getStore();
                                                store.removeAt(rowIndex);
                                            }
                                        });
                                    }
                                },
                                {
                                    iconCls: 'icon_edit icon_margin',
                                    itemId: 'actionedit',
                                    tooltip: 'Edit',
                                    handler: function (view, rowIndex, colIndex) {

                                        var store = view.getStore();
                                        var record = store.getAt(rowIndex);
                                        controller.valueConditionWind(view,record,me.leftAttributes);
                                    }
                                }
                            ]
                        },
                        {
                            text: i18n.getKey('description'),
                            dataIndex: 'description',
                            xtype: 'gridcolumn',
                            itemId: 'description',
                            width: 200,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('condition'),
                            dataIndex: 'condition',
                            xtype: 'componentcolumn',
                            itemId: 'condition',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="查看"';
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#" id="click-condition" style="color: blue">查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var clickElement = document.getElementById('click-condition');
                                            clickElement.addEventListener('click', function () {
                                                controller.conditionCheckWind(record,me.leftAttributes);
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ];

        me.callParent(arguments);
    },
    listeners: {
        afterrender: function (comp) {
            if (!Ext.isEmpty(comp.data)) {
                comp.setValue(comp.data);
            }
        }
    },

    disableTrigger:function(disable){
        var me=this;
        var fields=me.getComponent('inputKeys').getForm();
        Ext.Array.each(fields,function(fd){
             fd.setDisabled(disable);
        });
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if(item.xtype=='gridfield'){
                item.setSubmitValue(data[item.name]);
            }
            else{
                item.setValue(data[item.name]);
            }
        })
    },
    getValue: function () {
        var me = this,data={};
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if(item.xtype=='gridfield') {
                data[item.name] = item.getSubmitValue();
            }
            else{
                data[item.name] = item.getValue();
            }
        });
        return data;
    }
});
