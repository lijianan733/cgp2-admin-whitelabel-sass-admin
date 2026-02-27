/**
 * PMVTCombo
 * @Author: miao
 * @Date: 2022/3/30
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.common.PMVTCombo", {
    extend: "Ext.form.field.GridComboBox",
    alias: 'widget.pmvtcombo',
    editable: false,
    haveReset: true,
    displayField: 'displayName',
    valueField: 'productMaterialViewTypeId',//'productMaterialViewTypeId',
    matchFieldWidth: false,
    productConfigDesignId:null,

    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.store.MaterialViewType', {
            params: {
                filter: '[{"name":"productConfigDesignId","value":' + me.productConfigDesignId + ',"type":"number"}]'
            }
        });
        me.infoUrl = adminPath + 'api/productMaterialViewTypes?page=1&limit=25&filter=' + Ext.JSON.encode(
            [
                {
                    name: "productMaterialViewTypeId",
                    type: "string",
                    value: '%{productMaterialViewTypeId}%'
                },
                {
                    name: "productConfigDesignId",
                    type: "number",
                    value: me.productConfigDesignId
                }
            ]
        );
        me.gridCfg = {
            store: me.store,
            width: 450,
            maxHeight: 280,
            columns: [
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id')
                }, {
                    dataIndex: 'name',
                    flex: 1,
                    text: i18n.getKey('name')
                }, {
                    dataIndex: 'productMaterialViewTypeId',
                    flex: 1,
                    text: i18n.getKey('productMaterialViewTypeId')
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: me.store,
                emptyMsg: i18n.getKey('noData')
            }),
        };
        me.callParent(arguments);
    },
    diySetValue: function (data) {
        var me = this;
        if (data) {
            me.setInitialValue([data]);
        }
    },
    diyGetValue: function () {
        var me = this;
        return me.getSubmitValue()[0];
    },
});