/**
 * Created by nan on 2019/1/24.
 */
Ext.define('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.CreateNewConfigWindow', {
    extend: 'Ext.window.Window',
    constrain: true,
    width: 400,
    modal: true,
    height: 150,
    layout: 'fit',
    leftNavigateGrid: null,
    title: i18n.getKey('create') + i18n.getKey('bothWayAttributeRegulationConfig'),
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'

                },
                items: [
                    {
                        xtype: 'textfield',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('config') + i18n.getKey('name'),
                        name: 'name',
                        itemId: 'name'
                    }
                ],
                bbar: [
                    '->',
                    {
                        text: i18n.getKey('nextStep'),
                        iconCls: 'icon_next_step',
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            if (form.isValid()) {
                                var controller = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.controller.Controller');
                                me.leftNavigateGrid.rightTabPanel.show();
                                me.leftNavigateGrid.getSelectionModel().deselectAll();
                                var itemsGrid = me.leftNavigateGrid.rightTabPanel.getComponent('itemsGrid');
                                controller.rightItemGridLoadData(null, itemsGrid);
                                var editItemTabPanel = me.leftNavigateGrid.rightTabPanel.getComponent('editItemTabPanel');
                                me.leftNavigateGrid.rightTabPanel.remove(editItemTabPanel);
                                editItemTabPanel = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.EditItemTabPanel', {
                                    title: i18n.getKey('create') + i18n.getKey('mappingRelation'),
                                    record: null,
                                    itemsGridStore: itemsGrid.store,
                                    skuAttributes: me.skuAttributes
                                });
                                itemsGrid.name = form.getValues().name;
                                me.leftNavigateGrid.rightTabPanel.add([editItemTabPanel]);
                                me.leftNavigateGrid.rightTabPanel.setActiveTab(editItemTabPanel);
                                me.close();
                            }
                        }
                    },
                    {
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function (btn) {
                            me.close();
                        }
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
})