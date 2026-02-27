/**
 * Created by nan on 2019/1/22.
 */
Ext.define('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.EditItemTabPanel', {
    extend: 'Ext.tab.Panel',
    closable: true,
    outTab: null,
    record: null,
    itemsGridStore: null,
    itemId: 'editItemTabPanel',
    skuAttributes: null,//记录使用到的skuAttribute，一个 new Ext.util.MixedCollection()实例
    /**
     * editItemTabPanel加载item中的数据到界面中
     * @constructor
     */
    LoadItemData: function (record) {
        var me = this;
        var editItemAttributeForm = me.getComponent('editItemAttributeForm');
        var editItemConditionForm = me.getComponent('editItemConditionForm');
        editItemAttributeForm.setFormValue(record.get('left'), record.get('right'));
        editItemConditionForm.setFormValue(record.get('condition'));
    },
    initComponent: function () {
        var me = this;
        var editItemAttributeForm = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.EditItemAttributeForm', {
            outTab: me.outTab,
            record: me.record,
            title: (me.record ? i18n.getKey('edit') : i18n.getKey('create')) + i18n.getKey('mapping') + i18n.getKey('attribute'),
            skuAttributes: me.skuAttributes
        });
        var EditItemConditionForm = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.EditItemConditionForm', {
            outTab: me.outTab,
            record: me.record,
            title: (me.record ? i18n.getKey('edit') : i18n.getKey('create')) + i18n.getKey('mapping') + i18n.getKey('condition'),
            skuAttributes: me.skuAttributes
        })
        me.items = [editItemAttributeForm, EditItemConditionForm];
        me.callParent(arguments);
    }
})