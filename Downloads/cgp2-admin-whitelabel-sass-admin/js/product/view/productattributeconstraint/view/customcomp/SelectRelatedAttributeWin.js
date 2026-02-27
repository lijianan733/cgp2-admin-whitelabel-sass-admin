Ext.Loader.syncRequire([ 'Ext.ux.form.field.MultiCombo']);
Ext.define('CGP.product.view.productattributeconstraint.view.customcomp.SelectRelatedAttributeWin',{
    extend: 'Ext.window.Window',
    modal: true,
    width: 450,
    height: 150,
    layout: 'fit',
    initComponent: function(){
        var me = this;
        me.title = i18n.getKey('select')+i18n.getKey('constraintRelatedAttributes');
        var mainController = Ext.create('CGP.product.view.productattributeconstraint.controller.Controller');
        /*var skuAttributeStore = Ext.create('CGP.product.view.productattributeconstraint.store.SkuAttribute', {
            configurableId: me.productId
        });*/
        me.items = [{
            xtype: 'form',
            header: false,
            padding: 10,
            border: false,
            items: [
                {
                    fieldLabel: i18n.getKey('constraintRelatedAttributes'),
                    xtype: 'multicombobox',
                    editable: false,
                    isHidden: true,
                    //value: [155740, 155741],
                    name: 'relatedAttributeIds',
                    valueField: 'id',
                    width: 400,
                    store: me.skuAttributeStore,
                    displayField: 'displayName',
                    itemId: 'skuAttribute'
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
                        var relatedAttributeIds = me.form.getComponent('skuAttribute').getValue();

                        me.close();
                        Ext.create('Ext.window.Window',{
                            width: 900,
                            height: 750,
                            modal:true,
                            layout: 'fit',
                            title: i18n.getKey('new'),
                            autoShow: true,
                            items: [Ext.create('CGP.product.view.productattributeconstraint.view.FormToGrid',{
                                productId: me.productId,
                                configurableId: me.productId,
                                itemsID: me.itemsID,
                                itemId: 'createForm',
                                header: false,
                                skuAttributeStore: me.skuAttributeStore,
                                saveDisabled: false,
                                disabled: false,
                                skuAttributeIds: relatedAttributeIds,
                                editOrNew: 'new',
                                store: me.store
                            })]
                        });
                        //me.controller.editProductAttributeConstraintWin(editOrNew,me.store,me.tabPanel,null,me.productId,relatedAttributeIds)
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
