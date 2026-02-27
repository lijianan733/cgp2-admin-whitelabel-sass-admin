Ext.define('CGP.productcategory.view.website.Selector', {
    extend: 'Ext.form.field.ComboBox',
	requires: ["CGP.productcategory.config.Config"],
    
    alias: 'widget.websiteselector',
    mixins: ['Ext.ux.util.ResourceInit'],



    labelWidth: 70,
    displayField: 'name',
    valueField: 'id',
    editable: false,
    labelAlign: 'left',
    store: 'Website',
    value: Ext.create('CGP.productcategory.model.ProductCategory', {
        id: CGP.productcategory.config.Config.website,
        name: CGP.productcategory.config.Config.websiteName
    }),


    initComponent: function () {
        var me = this;


        me.fieldLabel = i18n.getKey('selectWebsite');
        me.callParent(arguments);
    }
});