Ext.define('CGP.cmspage.view.ManagerQueryOrFilter',{
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    initComponent: function(){
        var me = this;
        me.items = [{
            xtype: 'form',
            border: false,
            width: 450,
            height: 300,
            padding: '10 10 0 10',
            header: false,
            items: [{
                xtype : 'combo',
                itemId : 'type',
                name : 'type',
                width: 400,
                fieldLabel: i18n.getKey('type'),
                store: Ext.create('Ext.data.Store',{
                    fields: ['name','value'],
                    data: [{name: 'EXPRESSION',value: 'EXPRESSION'}]
                }),
                displayField : 'name',
                valueField : 'value',
                queryMode : 'local',
                value: me.data.type,
                editable : false
            },{
                fieldLabel: i18n.getKey('value'),
                name : 'value',
                width: 400,
                height: 200,
                value: me.data.value,
                xtype: 'textarea',
                itemId : "value"
            },{
                fieldLabel : i18n.getKey('id'),
                name : 'id',
                hidden: true,
                width: 350,
                value: me.data.id,
                xtype: 'numberfield',
                itemId : "id"
            }]
        }];
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('confirm'),
            handler: function(){
                var form = me.down('form');
                var data = form.getValues();
                me.controller.saveQueryOrFilter(data,me,me.type);
            }
        },{
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function(){

            }
        }];
        me.callParent(arguments);
    }
});