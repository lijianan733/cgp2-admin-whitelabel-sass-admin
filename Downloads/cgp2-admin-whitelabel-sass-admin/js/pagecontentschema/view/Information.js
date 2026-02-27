/**
 * Created by nan on 2020/8/24.
 */

/**
 *详细页
 **/
Ext.Loader.syncRequire([
    'CGP.pagecontentschema.model.PageContentSchema',
    'CGP.pagecontentschema.view.ShapeConfigFieldSet'
]);
Ext.define('CGP.pagecontentschema.view.Information', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.information',
    padding: '10 30 10 30',
    title: i18n.getKey('information'),
    defaults: {
        width: 550,
        labelAlign: 'left',
        labelWidth: 50
    },
    isValidForItems: true,//是否校验时用item.forEach来处理
    itemId: 'information',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            },
            {
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            }, {
                name: 'code',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('code'),
                itemId: 'code'
            },
            {
                name: 'width',
                fieldLabel: i18n.getKey('width'),
                xtype: 'numberfield',
                hideTrigger: true,
                itemId: 'width',
                allowBlank: false,
                emptyText:'width，height向上取整',
                submitEmptyText:false
            },
            {
                name: 'height',
                fieldLabel: i18n.getKey('height'),
                xtype: 'numberfield',
                hideTrigger: true,
                itemId: 'height',
                allowBlank: false,
                emptyText:'width，height向上取整',
                submitEmptyText:false
            },
            {
                name: 'clipPath',
                xtype: 'shapeconfigfieldset',
                title: i18n.getKey('clipPath'),
                itemId: 'clipPath',
                labelAlign: 'top',
                minHeight: 0,
                onlySubProperty: true,

            }
        ];
        me.callParent(arguments);

    },
    refreshData: function (data) {
        var me = this;
        Ext.Array.each(me.items.items, function (item) {
            if (item.xtype == 'gridfield') {
                data[item.name] = item.setSubmitValue();
            } else {
                item.setValue(data[item.name]);
            }
        });

    }
});
