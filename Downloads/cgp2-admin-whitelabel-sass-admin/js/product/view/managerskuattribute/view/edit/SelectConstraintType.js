Ext.define('CGP.product.view.managerskuattribute.view.edit.SelectConstraintType',{
    extend: 'Ext.window.Window',
    modal: true,
    width: 450,
    height: 150,
    layout: 'fit',
    initComponent: function(){
        var me = this;
        me.title = i18n.getKey('selectConstraintType');
        me.items = [{
            xtype: 'form',
            header: false,
            padding: 10,
            border: false,
            items: [
                {
                    xtype: 'combo',
                    width: 350,
                    allowBlank: false,
                    store: Ext.create('Ext.data.Store',{
                        fields: [
                            {name: 'name',type: 'string'},
                            {name: 'value',type: 'string'}
                        ],
                        data: [
                            {
                                name: 'RangeConstraint',
                                value: 'com.qpp.cgp.domain.product.attribute.constraint.RangeConstraint'
                            },{
                                name: 'OptionConstraint',
                                value: 'com.qpp.cgp.domain.product.attribute.constraint.OptionConstraint'
                            },{
                                name: 'RegexConstraint',
                                value: 'com.qpp.cgp.domain.product.attribute.constraint.RegexConstraint'
                            }
                        ]
                    }),
                    valueField: 'value',
                    editable: false,
                    displayField: 'name',
                    fieldLabel: i18n.getKey('type'),
                    queryMode: 'local',
                    itemId: 'selectConstraintType'

                }
            ]
        }];
        me.bbar = [
            '->',{
                xtype: 'button',
                text: i18n.getKey('nextStep'),
                handler: function(){
                    var editOrNew = 'new';
                    if(me.form.isValid()){
                        var constraintType = me.form.getComponent('selectConstraintType').getValue();
                        me.close();
                        me.controller.editConstraintWin(editOrNew,constraintType,me.skuAttributeId,me,me.store,null,me.configurableId,me.tabPanel);
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function(){
                    me.close();
                }
            }
        ];
        me.callParent(arguments);
        me.form = me.down('form');
    }
});