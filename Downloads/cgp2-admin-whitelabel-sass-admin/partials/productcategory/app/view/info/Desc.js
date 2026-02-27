Ext.define('CGP.productcategory.view.info.Desc', {
    extend: 'Ext.ux.form.Panel',
    alias: 'widget.infodesc',
    mixins: ['Ext.ux.util.ResourceInit'],


    model: 'CGP.productcategory.model.ProductCategory',




    constructor: function (config) {

        var me = this;



        config.columnCount = 1;
        config.items = [{
            xtype: 'hidden',
            itemId: 'id',
            name: 'id',
            fieldLabel: i18n.getKey('id'),
            hidden: true,
            style: 'margin:10px'
        }, {
            xtype: 'numberfield',
            itemId: 'sortOrder',
            name: 'sortOrder',
            fieldLabel: i18n.getKey('sortOrder'),
            style: 'margin:10px'
        }, {
            xtype: 'textfield',
            itemId: 'name',
            name: 'name',
            fieldLabel: i18n.getKey('name'),
            style: 'margin:10px'
        }, {
            xtype: 'checkboxfield',
            itemId: 'invisible',
            name: 'invisible',
            fieldLabel: i18n.getKey('invisible'),
            style: 'margin:10px'
        }, {
            xtype: 'htmleditor',
            itemId: 'shortDescription',
            name: 'shortDescription',
            fieldLabel: i18n.getKey('shortDescription'),
            style: 'margin:10px',
            width: 800
        }, {
            xtype: 'htmleditor',
            itemId: 'description1',
            name: 'description1',
            fieldLabel: i18n.getKey('description1'),
            style: 'margin:10px',
            width: 800
        }, {
            xtype: 'htmleditor',
            itemId: 'description2',
            name: 'description2',
            fieldLabel: i18n.getKey('description2'),
            style: 'margin:10px',
            width: 800
        }, {
            xtype: 'htmleditor',
            itemId: 'description3',
            name: 'description3',
            fieldLabel: i18n.getKey('description3'),
            style: 'margin:10px',
            width: 800
        }];

        me.callParent(arguments);

    },



    initComponent: function () {

        var me = this;



        me.title = i18n.getKey('description');


        me.callParent(arguments);

    },

    refreshData: function (record) {
        var me = this;

        me.form.setValuesByModel(record);
    }

})