Ext.define("CGP.bommaterial.edit.module.customerattribute.AddOption",{
    extend : 'Ext.window.Window',
    record : null,//一个option选项
    controller : null,//MainController
    modal : true,
    closeAction: 'hidden',
    resizable : false,
    minWidth: 200,
    height: 220,
    buttonAlign : 'left',
    bodyStyle: {
        padding: '10px',
        paddingTop : '20px'
    },
    initComponent : function(){
        var me = this;
        if(me.createOrEdit == 'edit'){
            me.title = i18n.getKey('edit');
        }else {
            me.title = i18n.getKey('create');
        }
        me.items = [{
            xtype: 'form',
            border: false,
            listeners: {
                render: function(comp){
                    if(me.valueType == 'Boolean'){
                        comp.insert(1,{
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('value'),
                            labelWidth : 60,
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    {name: 'name'},
                                    {name: 'value', type: 'boolean'}
                                ],
                                data: [
                                    {name: '是', value: true},
                                    {name: '否', value: false}
                                ]
                            }),
                            editable: false,
                            itemId: 'value',
                            allowBlank: false,
                            displayField: 'name',
                            valueField: 'value'
                        })
                    }else if(Ext.Array.contains(['int','Number'],me.valueType)){
                        comp.insert(1,{
                            xtype : 'numberfield',
                            labelWidth : 60,
                            allowBlank: false,
                            fieldLabel : i18n.getKey('value'),
                            itemId : 'value',
                            value : me.record.get("value")
                        })
                    }else{
                        comp.insert(1,{
                            xtype: 'textfield',
                            fieldLabel : i18n.getKey('value'),
                            allowBlank : false,
                            labelWidth : 60,
                            itemId: 'value',
                            value : me.record.get("value")
                        })
                    }
                }
            },
            items:[{
                xtype : 'textfield',
                fieldLabel : i18n.getKey('name'),
                allowBlank : false,
                labelWidth : 60,
                itemId: 'name',
                value : me.record.get("name")
            },{
                xtype : 'numberfield',
                labelWidth : 60,
                allowBlank: false,
                fieldLabel : i18n.getKey('sortOrder'),
                itemId : 'sortOrder',
                value : me.record.get("sortOrder")
            }]}];
        me.buttons = [{
            text : i18n.getKey('ok'),
            itemId : 'okBtn',
            handler : function(btn){
                if(me.form.isValid()){
                    var name = me.form.getComponent('name').getValue();
                    var sortOrder = me.form.getComponent('sortOrder').getValue();
                    var value = me.form.getComponent('value').getValue();
                    var store = me.grid.getStore();
                    if(me.createOrEdit == 'create'){
                        var record = Ext.create('CGP.bommaterial.model.AttributeOption',{
                            id: null,
                            name: name,
                            value: value,
                            sortOrder: sortOrder
                        })
                        store.insert(1,record);
                    }else{
                        me.record.set('name',name);
                        me.record.set('sortOrder',sortOrder);
                        me.record.set('value', value);
                    }
                    me.close();
                }
            }
        },{
            text : i18n.getKey('cancel'),
            handler : function(btn){
                me.close();
            }
        }];
        me.callParent(arguments);
        me.form = me.down('form');
    }
});