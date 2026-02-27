/**
 * Created by nan on 2021/7/14
 * 通过view配置的id,查找出关联的design上PMVT和SMVT关联的模板下载配置
 *
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.store.TemplateGroupStore'
])
Ext.define("CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.TemplateGroupIdField", {
    extend: 'Ext.form.field.GridComboBox',
    alias: 'widget.templategroupidfield',
    matchFieldWidth: false,
    autoQuery: false,
    viewConfigId: null,
    valueField: 'groupId',
    displayField: 'groupId',
    valueType: 'id',
    editable: false,
    haveReset: true,
    diyGetValue: function () {
        var data = this.getSubmitValue();
        if (data.length > 0) {
            return data[0];
        }
    },
    diySetValue: function (data) {
        this.setValue({groupId: data})
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.store.TemplateGroupStore', {
            storeId: 'templateGroupStore',
            autoLoad: false,
            viewConfigId: me.viewConfigId
        });
        me.gridCfg = {
            viewConfig: {
                enableTextSelection: true
            },
            height: 400,
            width: 800,
            allowBlank: true,
            columns: [
                {
                    dataIndex: 'groupId',
                    name: 'groupId',
                    text: i18n.getKey('groupId'),
                },
                {
                    dataIndex: 'mvtId',
                    name: 'mvtId',
                    text: i18n.getKey('pmvt/smvt'),
                    width: 200,
                    renderer: function (value, mateData, record) {
                        var type = record.get('type');
                        return (i18n.getKey('type') + ' : ' + type + '<br>'
                            + i18n.getKey('mvtId') + ' : ' + value);
                    }
                },
                {
                    dataIndex: 'materialPath',
                    name: 'materialPath',
                    width: 200,
                    text: i18n.getKey('materialPath')
                },
                {
                    dataIndex: 'productMaterialViewTypeTemplateConfigs',
                    name: 'productMaterialViewTypeTemplateConfigs',
                    flex: 1,
                    xtype: 'arraycolumn',
                    text: i18n.getKey('下载的文件'),
                    renderer: function (value, mateData, record) {
                        return value.fileName + '.' + value.fileType;
                    }
                }
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: me.store,
                displayInfo: true, // 是否 ? 示， 分 ? 信息
                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                emptyMsg: i18n.getKey('noData')
            }
        };
        me.callParent();
    }

})