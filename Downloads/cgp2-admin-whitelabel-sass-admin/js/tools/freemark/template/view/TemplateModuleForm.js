/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.tools.freemark.template.view.TemplateModuleForm", {
    extend: "Ext.ux.form.ErrorStrickForm",
    requires : ["CGP.tools.freemark.template.view.KeyForm",
        'CGP.tools.freemark.template.model.Group'],
    bodyPadding: '10',
    autoScroll: true,
    // isValidForItems:true,
    region: 'center',
    defaults: {
        width: '100%'
    },
    leftAttributes:null,
    variableStore: null,
    currRecord:null,
    initComponent: function () {
        var me = this;
        var controller=Ext.create('CGP.tools.freemark.template.controller.Controller');
        var conditionInputModel=Ext.create('CGP.tools.freemark.template.model.Group');
        var conditionStore=Ext.create('CGP.tools.freemark.template.store.Group',
            {
                listeners: {
                    datachanged: function (store) {
                        var varKeyComp=me.getComponent('varKeys')
                        if (!varKeyComp.isDisabled()&&store.count() > 0){
                            // varKeyComp.setDisabled(store.count() > 0);
                            me.disableTrigger(store.count() > 0)
                        }
                        else if (varKeyComp.isDisabled()&&store.count() == 0){
                            me.disableTrigger(store.count() > 0)
                        }
                    }
                }
            });

        me.items=[
            {
                xtype:'keysform',
                name:'varKeys',
                itemId:'varKeys',
                allowBlank: false,
                disabledCls:''
            },
            {
                xtype:'gridfield',
                name:'groups',
                itemId:'groups',
                allowBlank: false,
                gridConfig:{
                    renderTo:'valueConditionGrid',
                    store: conditionStore,
                    maxHeight: 300,
                    width:'98%',
                    tbar: [
//                        '->',
                        {
                            text: i18n.getKey('add'),
                            iconCls: 'icon_add',
                            handler: function (comp) {
                                var currGrid=comp.ownerCt.ownerCt;
                                var inputKeysField=me.getComponent('varKeys');
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
                                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('必须添加变量'));
                                    return false;
                                }
                                conditionInputModel.data=conditionInputData;
                                controller.valueConditionWind(currGrid,conditionInputModel,me.productId);
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
                            dataIndex:'variables',
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
                                        controller.valueConditionWind(view,record,me.productId);
                                    }
                                }
                            ]
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
                                                controller.valueConditionWind(me.getComponent('condition'),record,me.productId);
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
            if (!Ext.isEmpty(comp.currRecord?.data)) {
                comp.setValue(comp.currRecord?.data);
            }
        }
    },

    disableTrigger:function(disable){
        var me=this;
        var fields=me.getComponent('varKeys').getForm().getFields();
        var btn=me.getComponent('varKeys').getDockedItems('toolbar[dock="top"]')[0];
        if(btn){
            btn.setDisabled(disable);
        }
        fields.each(function(fd){
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
    },
    isValid: function () {
        var me = this, isValid = true;
        if(me.disabled){
            return isValid;
        }
        var items=me.items.items;
        for(var i=0;i<items.length;i++){
            var item=items[i];
            //不为空验证
            if(!item.allowBlank && Ext.isEmpty(item.getValue())){
                item.markInvalid('该输入项为必输项');
                item.renderActiveError();
                isValid= false;
                break;
            }
            //不重复添加验证
            if(!item.isValid()){
                isValid= false;
                break;
            }
        }
        return isValid;
    },
});
