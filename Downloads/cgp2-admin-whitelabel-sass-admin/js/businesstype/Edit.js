/**
 * Created by nan on 2021/9/11
 */
Ext.Loader.syncRequire([
    'CGP.pcresourcelibrary.config.Config',//
    'CGP.businesstype.model.BusinessTypeModel'
])
Ext.onReady(function () {
    var page = Ext.widget({
        block: 'businesstype',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.businesstype.model.BusinessTypeModel',
            remoteCfg: false,
            items: [
                {
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                },
                {
                    name: 'clazz',
                    xtype: 'textfield',
                    hidden: true,
                    value: 'com.qpp.cgp.domain.pcresource.BusinessLibrary',
                    fieldLabel: i18n.getKey('clazz'),
                    itemId: 'clazz'
                }, {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    allowBlank: false,
                }, {
                    name: '_id',
                    xtype: 'textfield',
                    allowBlank: true,
                    hidden: true,
                    fieldLabel: i18n.getKey('_id'),
                    itemId: '_id'
                }, {
                    xtype: 'combo',
                    name: 'type',
                    itemId: 'type',
                    fieldLabel: i18n.getKey('resources') + i18n.getKey('type'),
                    editable: false,
                    allowBlank: false,
                    valueField: 'value',
                    displayField: 'display',
                    store: {
                        type: 'store',
                        fields: ['value', 'display'],
                        data: CGP.pcresourcelibrary.config.Config.IPCResourceType
                    }
                }]
        },
    });
});
