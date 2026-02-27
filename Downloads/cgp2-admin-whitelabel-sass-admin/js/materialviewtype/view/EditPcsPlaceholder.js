Ext.Loader.syncRequire([]);
Ext.define('CGP.materialviewtype.view.EditPcsPlaceholder',{
    extend: 'Ext.window.Window',
    modal: true,
    width: 500,
    layout: 'fit',
    initComponent: function(){
        var me = this;
        me.title = i18n.getKey(me.editOrNew)+i18n.getKey('pcsPlaceholder');
        me.items = [{
            xtype: 'form',
            header: false,
            padding: 10,
            border: false,
            listeners: {
                render: function(comp){
                    var items = comp.items.items;
                    if(!Ext.isEmpty(me.record)){
                        Ext.Array.each(items,function(item){
                            item.on('render',function(){
                                item.setValue(me.record.get(item.name));
                            })
                        })
                    }
                }
            },
            items: [
                {
                    xtype: 'textfield',
                    itemId: 'clazz',
                    hidden: true,
                    width: 450,
                    value: 'com.qpp.cgp.domain.bom.TemplatePlaceholder',
                    allowBlank: false,
                    name: 'clazz'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('selector'),
                    itemId: 'selector',
                    width: 450,
                    allowBlank: false,
                    name: 'selector'
                },
                {
                    xtype: 'textarea',
                    fieldLabel: i18n.getKey('attributes'),
                    itemId: 'attributes',
                    width: 450,
                    allowBlank: false,
                    name: 'attributes'
                },
                {
                    xtype: 'textarea',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description',
                    width: 450,
                    name: 'description'
                },
                {
                    xtype: 'textarea',
                    fieldLabel: i18n.getKey('expression'),
                    itemId: 'expression',
                    width: 450,
                    name: 'expression'
                }
            ]
        }];
        me.bbar = [
            '->',{
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_add',
                handler: function(){
                    var items = me.form.items.items;
                    var data = {};
                    if(me.form.isValid()){
                        if(!Ext.isEmpty(me.record)){
                            Ext.Array.each(items,function(item){
                                if(item.name == 'attributes'){
                                    var attributes = item.getValue().split(',');
                                    me.record.set(item.name,attributes);
                                }else{
                                    me.record.set(item.name,item.getValue());
                                }
                            });
                        }else{
                            Ext.Array.each(items,function(item){
                                if(item.name == 'attributes'){
                                    data[item.name] = item.getValue().split(',');
                                }else{
                                    data[item.name] = item.getValue();
                                }
                            });
                            me.store.add(data);
                        }
                        me.close();

                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function(){
                    me.close();
                }
            }
        ];
        me.callParent(arguments);
        me.form = me.down('form');
    }
});