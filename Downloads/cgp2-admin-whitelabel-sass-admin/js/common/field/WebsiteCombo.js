/**
 * @Description:
 * @author nan
 * @date 2022/7/14
 */
Ext.Loader.syncRequire([
    'CGP.common.store.AllWebsite'
])
Ext.define('CGP.common.field.WebsiteCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.websitecombo',
    autoScroll: true,
    editable: false,
    fieldLabel: i18n.getKey('website'),
    bottomToolbarHeight: 32,
    displayField: 'name',
    valueField: 'id',
    queryMode: 'remote',
    matchFieldWidth: true,
    pickerAlign: 'tl-bl',
    value: 11,
    initComponent: function () {
        var me = this;
        me.store = me.store || Ext.create('CGP.common.store.AllWebsite',{
            autoLoad: false
        });
        me.callParent();
        me.on('afterrender', function (combo) {
            var store = combo.getStore();
            store.on('load', function () {
                this.insert(0, {
                    id: null,
                    name: i18n.getKey('allWebsite')
                });
            });
        });
    }
})