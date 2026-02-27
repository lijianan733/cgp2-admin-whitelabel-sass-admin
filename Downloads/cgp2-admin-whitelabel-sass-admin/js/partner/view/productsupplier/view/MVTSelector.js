/**
 * @Description:
 * @author nan
 * @date 2025/4/11
 */
Ext.define('partner.productSupplier.view.MVTSelector', {
    extend: 'Ext.form.field.GridComboBox',
    alias: 'widget.mvt_selector',
    displayField: 'code',
    valueField: '_id',
    editable: false,
    matchFieldWidth: false,
    allMVTData: null,
    designId: null,
    haveReset: false,
    productConfigDesignId: null,
    enableClazz: [
        'com.qpp.cgp.domain.bom.ProductMaterialViewType',
        'com.qpp.cgp.domain.bom.MaterialMvt'
    ],
    version: 'v1',
    setInitialValue: function (obj) {
        var me = this;
        if (obj.materialViewTypeCode || obj.productMaterialViewTypeId) {
            var productConfigDesignId = me.productConfigDesignId;
            if (obj.mvtType == 'PMVT') {
                if (me.version == 'v1') {
                    //这个是有分页的
                    var infoUrl = adminPath + `api/productMaterialViewTypes/product/${me.productId}?id=${me.productId}&page=1&limit=25&start=0&filter=` +
                        Ext.JSON.encode([{
                            "name": "productMaterialViewTypeId",
                            "value": obj.productMaterialViewTypeId,
                            "type": 'string'
                        }]);
                } else {
                    //这个是有分页的
                    var infoUrl = adminPath + 'api/productMaterialViewTypes?page=1&limit=25&filter=' + Ext.JSON.encode([
                        {
                            name: "productMaterialViewTypeId",
                            type: "string",
                            value: obj.productMaterialViewTypeId
                        },
                        {
                            name: "productConfigDesignId",
                            type: "number",
                            value: productConfigDesignId
                        }
                    ]);
                }
            } else if (obj.mvtType == 'MMVT') {
                //这个是没分页的
                //api/materialMvts/50825830/productConfigDesign/70770785
                var infoUrl = adminPath + `api/materialMvts/${obj.materialViewTypeCode}/productConfigDesign/${productConfigDesignId}`;
            }
            JSAjaxRequest(infoUrl, 'GET', true, null, false, function (require, success, response) {
                if (success) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    var data = {};
                    if (responseText?.data?.content) {
                        data = responseText.data.content;
                    } else {
                        data = responseText.data || [];
                    }
                    me.setValue(data);
                }
            });
        }
    },
    diySetValue: function (obj) {
        this.setInitialValue(obj);
    },
    diyGetValue: function () {
        var me = this;
        return me.getSubmitValue()[0];
    },
    loadMVTData: function () {
        var gridCombo = this;
        var filter = gridCombo.filter;
        var grid = gridCombo.picker.grid;
        var testData = gridCombo.allMVTData;
        var queryData = filter.getQuery();
        //筛选出指定的记录
        var result = testData.filter(function (item) {
            return Ext.Array.contains(gridCombo.enableClazz, item.clazz);
        });
        queryData.map(function (data) {
            var key = data.name;
            result = result.filter(function (item) {
                var str = String(item[key]);
                return (str.indexOf(data.value) != -1)
            })
        });
        grid.store.proxy.data = result;
        grid.store.load();
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'pagingmemory'
            },
            pageSize: 25,
            fields: ['_id', 'name', 'materialPath', 'code', 'materialViewType', 'clazz', 'productMaterialViewTypeId'],
            data: []
        });
        me.gridCfg = Ext.Object.merge({
            height: 350,
            width: 850,
            gridCombo: me,
            columns: [
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id'),
                },
                {
                    dataIndex: 'name',
                    text: i18n.getKey('name'),
                    flex: 1
                },
                {
                    dataIndex: 'code',
                    text: i18n.getKey('code'),
                    flex: 1
                },
                {
                    dataIndex: 'clazz',
                    text: i18n.getKey('type'),
                    renderer: function (value) {
                        if (value == 'com.qpp.cgp.domain.bom.ProductMaterialViewType') {
                            return 'PMVT';
                        } else if (value == 'com.qpp.cgp.domain.simplifyBom.SimplifyMaterialViewType') {
                            return 'SMVT';
                        } else if (value == 'com.qpp.cgp.domain.bom.MaterialMvt') {
                            return 'MMVT';
                        }
                    }
                },
                {
                    dataIndex: 'materialPath',
                    text: i18n.getKey('materialPath'),
                    flex: 1
                },
                {
                    xtype: 'componentcolumn',
                    dataIndex: 'materialViewType',
                    text: i18n.getKey('materialViewType'),
                    flex: 1,
                    minWidth: 200,
                    renderer: function (value, metadata, record) {
                        var name = '';
                        if (!Ext.isEmpty(value['name'])) {
                            name = value['name'];
                        }
                        var description = '';
                        if (!Ext.isEmpty(value['description'])) {
                            description = value['description'];
                        }
                        var mvtId = record.raw.materialViewType._id;
                        return {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    value: i18n.getKey('id') + '：' + '<a href="#" class="click-materialViewType">' + '(' + mvtId + ')' + '</a>'
                                        + '<br>' + i18n.getKey('name') + '：' + name
                                        + '<br>' + i18n.getKey('description') + '：' + description,
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByClassName('click-materialViewType')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function (event) {
                                                JSOpen({
                                                    id: 'materialviewtypepage',
                                                    url: path + 'partials/materialviewtype/main.html?materialViewTypeId=' + mvtId,
                                                    title: i18n.getKey('materialViewType'),
                                                    refresh: true
                                                })
                                            }, false);
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: me.store,
            },
            listeners: {}
        }, me.gridCfg);
        me.filterCfg = Ext.Object.merge({
            layout: {
                type: 'table',
                columns: 3
            },
            searchActionHandler: function (btn) {
                var me = this;
                var filter = me.ownerCt.ownerCt;
                var gridpanel = filter.ownerCt;
                gridpanel.gridCombo.loadMVTData();
            },
            header: false,
            items: [
                {
                    xtype: 'textfield',
                    name: '_id',
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id',
                    isLike: false
                },
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name',
                    isLike: false
                },
                {
                    xtype: 'textfield',
                    name: 'code',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code',
                    vtype: 'code',
                    isLike: false
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('类型'),
                    valueField: 'value',
                    displayField: 'display',
                    itemId: 'clazz',
                    name: 'clazz',
                    isLike: false,
                    editable: false,
                    store: {
                        xtype: 'store',
                        fields: [{
                            name: 'value',
                            type: 'string'
                        }, {
                            name: 'display',
                            type: 'string'
                        }],
                        data: (function () {
                            var arr = [
                                {
                                    display: 'PMVT',
                                    value: 'com.qpp.cgp.domain.bom.ProductMaterialViewType'
                                },
                                {
                                    display: 'SMVT',
                                    value: 'com.qpp.cgp.domain.simplifyBom.SimplifyMaterialViewType'
                                },
                                {
                                    display: 'MMVT',
                                    value: 'com.qpp.cgp.domain.bom.MaterialMvt'
                                },
                            ];
                            var result = arr.filter(function (item) {
                                return Ext.Array.contains(me.enableClazz, item.value)
                            });
                            return result;
                        })()
                    },
                }
            ]
        }, me.filterCfg);
        me.callParent();
        me.on('expand', function () {
            me.loadMVTData();
        }, me, {
            single: true,
        })
    }
})