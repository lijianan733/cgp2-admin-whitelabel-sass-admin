/**
 * ProductFilter
 * @Author: miao
 * @Date: 2021/11/8
 * 以下是已存在的查询控件，可进行修改和添加查询控件：
 *
 * - idFilter: id查询控件，xtype: numberfield
 * - typeFilter: type查询控件，xtype: combo
 * - skuFilter: sku查询控件, xtype: textfield
 * - nameFilter: name查询控件, xtype: textfield
 * - modelFilter： modelFilter查询控件, xtype: textfield
 * - mainCategoryFilter: 主类目查询控件, xtype: treecombo
 * - subCategoryFilter: 产品类目查询控件, xtype: treecombo
 */
Ext.define('CGP.tax.view.productcategory.ProductFilter', {
    extend: 'Ext.form.Panel',
    alias: 'widget.taxproductfilter',
    mixins: {
        configurable: 'Ext.ux.util.Configurable'
    },
    cfgModel: 'Ext.ux.configuation.ViewConfigModel',
    filterDate: null,
    filterText: {
        reach: 'to',
        read: 'Search',
        clear: 'Clear',
        query: 'Query',
        type: 'Type',
        sku: 'SKU',
        name: 'Name',
        model: 'Model',
        maincategory: 'MainCategory',
        subCategories: 'SubCategory',
        // website: 'website',
        id: 'id',
        configurableProductId: 'configurableProductId'
    }
    /**
     * @cfg {Number} columnCount
     * 设置每行组件允许的列数
     */,
    config: {
        columnCount: 3,
        bodyStyle: 'padding:10px 5px 5px',
        searchAction: true,
        clearAction: true,
        header: false,
        searchActionHandler: Ext.emptyFn,
        autoScroll: true,
        fieldDefaults: {
            labelAlign: 'right',
            layout: 'anchor',
            width: 260,
            labelWidth: 80,
            style: 'margin-right:20px; margin-top : 5px;'
        },
        items: [],
        read: 'Search',
        clear: 'Clear',
        buttonAlign: 'left'
    }
    /* @override */,
    constructor: function (config) {
        var me = this;
        initResource(me.filterText);
        config = config || {};
        config.idFilter = config.idFilter || {};
        config.typeFilter = config.typeFilter || {};
        config.skuFilter = config.skuFilter || {};
        config.nameFilter = config.nameFilter || {};
        config.modelFilter = config.modelFilter || {};
        // config.websiteFilter = config.websiteFilter || {};
        config.mainCategoryFilter = config.mainCategoryFilter || {};
        config.subCategoryFilter = config.subCategoryFilter || {};
        config.configurableIdFilter = config.configurableIdFilter || {};
        config.excludePartnerFilter = config.excludePartnerFilter || {};

        Ext.applyIf(config.idFilter, {
            name: 'id',
            xtype: 'numberfield',
            fieldLabel: me.filterText.id,
            itemId: 'id',
            minValue: 1,
            allowDecimals: false,
            allowExponential: false,
            hideTrigger: true
        });
        Ext.applyIf(config.nameFilter, {
            name: 'name',
            itemId: 'name',
            fieldLabel: me.filterText.name,
            xtype: 'textfield'
        });
        Ext.applyIf(config.modelFilter, {
            name: 'model',
            itemId: 'model',
            xtype: 'textfield',
            fieldLabel: me.filterText.model
        })
        Ext.applyIf(config.typeFilter, {
            name: 'type',
            xtype: 'combo',
            fieldLabel: me.filterText.type,
            itemId: 'type',
            editable: false,
            store: Ext.create('Ext.data.Store', {
                fields: ['type', "value"],
                data: [
                    {
                        type: 'Sku', value: 'SKU'
                    },
                    {
                        type: 'Configurable', value: 'Configurable'
                    }
                ]
            }),
            displayField: 'type',
            valueField: 'value',
            queryMode: 'local'
        });
        Ext.applyIf(config.skuFilter, {
            name: 'sku',
            xtype: 'textfield',
            fieldLabel: me.filterText.sku,
            itemId: 'sku'
        });
        // Ext.applyIf(config.websiteFilter, {
        //     name: 'mainCategory.website.id',
        //     xtype: 'combobox',
        //     fieldLabel: me.filterText.website,
        //     itemId: 'website',
        //     store: Ext.create("CGP.common.store.Website"),
        //     displayField: 'name',
        //     valueField: 'id',
        //     value: config.websiteId,
        //     editable: false
        // });
        Ext.applyIf(config.configurableIdFilter, {
            name: 'configurableProduct.id',
            xtype: 'numberfield',
            fieldLabel: me.filterText.configurableProductId,
            itemId: 'configurableId',
            minValue: 1,
            allowDecimals: false,
            allowExponential: false,
            hideTrigger: true
        });
        Ext.applyIf(config.mainCategoryFilter, {
            name: 'mainCategory',
            xtype: 'productcategorycombo',
            fieldLabel: me.filterText.maincategory,
            itemId: 'mainCategory',
            //store: me.mainCategoryStore,
            isMain: true,
            defaultWebsite: config.websiteId || 11,
            websiteSelectorEditable: config.websiteId ? false : true,
            displayField: 'name',
            valueField: 'id',
            isLike: false,
            selectChildren: false,
            canSelectFolders: true,
            multiselect: true
        });
        Ext.applyIf(config.subCategoryFilter, {
            name: 'subCategories',
            xtype: 'productcategorycombo',
            fieldLabel: me.filterText.subCategories,
            itemId: 'subCategories',
            //store: me.subCategoryStore,
            isMain: false,
            isLike: false,
            displayField: 'name',
            defaultWebsite: config.websiteId || 11,
            websiteSelectorEditable: config.websiteId ? false : true,
            valueField: 'id',
            selectChildren: false,
            canSelectFolders: true,
            multiselect: true
        });
//修改接口后，无需传该参数了，传入隐藏的[{excludePartner.id","value":146,"type":"number"}]
        Ext.applyIf(config.excludePartnerFilter, {
            name: 'excludeCategory.id',
            xtype: 'numberfield',
            hidden: true,
            isLike: false,
            value: config.categoryId
        });
        config = Ext.merge({
            autoScroll: me.config.autoScroll,
            layout: {
                type: 'table',
                columns: me.config.columnCount
            },
            title: me.filterText.title,
            items: []
        }, config);
        me._items = config.items;


        config.items = [config.idFilter, config.nameFilter, config.modelFilter,
            config.typeFilter, config.skuFilter, config.websiteFilter, config.configurableIdFilter, config.mainCategoryFilter, config.subCategoryFilter, config.excludePartnerFilter]; //在loadConfigData中添加新配置的items
        //        config.title = me.filterText.query;
        me.callParent([config]);

        me.addButton();

        if (me.remoteCfg && (me.cfgStore || me.cfgProxy || me.cfgData)) {
            me.loadConfig();
        } else {
            var data = [];
            Ext.Array.forEach(me._items, function (c) {
                data.push({
                    data: {
                        visible: true,
                        configuration: c
                    }
                });
            });
            me.loadConfigData(data);
        }
    },

    onRender: function (parentNode, containerIdx) {
        var me = this;
        me.callParent(arguments);
        me.el.on("keydown", function (event, target) {
            if (event.button == 12) {
                var searchButton = me.getComponent("fieldContainer").getComponent("searchButton");
                searchButton.handler(searchButton);
            }
        });
    },

    /**
     *  @protected
     */
    addButton: function () {

        var me = this;

        //加入search按钮和clear按钮
        if (me.searchAction || me.clearAction) {

            var containerItems = [];

            if (me.config.searchAction) {
                containerItems.push({
                    xtype: 'button',
                    text: me.filterText.read,
                    handler: me.searchActionHandler,
                    itemId: 'searchButton',
                    iconCls: 'icon_query'
                })
            }

            if (me.config.clearAction) {
                containerItems.push({
                    xtype: 'button',
                    text: me.filterText.clear,
                    itemId: 'clearButton',
                    iconCls: 'icon_clear',
                    style: 'margin-left:15px',
                    handler: function () {
                        me.reset();
                    }
                })
            }

            me._items.push({
                xtype: 'fieldcontainer',
                width: 200,
                layout: 'hbox',
                itemId: 'fieldContainer',
                defaults: {
                    flex: 1
                },
                style: 'margin-left:60px',
                items: containerItems
            });

        }

    },
    /**
     *  @protected
     */
    loadConfigData: function (records) {
        var me = this;
        me.suspendLayouts();
        /*me.items.each(function (i) {
         me.remove(i);
         });*/
        Ext.each(records, function (item) {
            me.addColumn(item.data);
        }, this);
        me.resumeLayouts(true);
    },
    showConfigError: function (msg) {
        var item = Ext.ComponentManager.create({
            html: '<span>' + this.configErrorText + ':<br/>' + msg + '</span>',
            border: false
        }, 'container');
        this.add(item);
    },

    /**
     *  @protected
     *  添加查询控件
     */
    addColumn: function (obj) {
        var me = this;
        var cfg;
        try {
            if (Ext.isObject(obj['configuration'])) {
                cfg = obj['configuration'];
                Ext.Object.each(me.filterParams, function (key, value) {
                    if (key == cfg.name) {
                        //cfg.value = value;
                    }
                })
            } else {
                if (!obj['visible']) return;
                eval('cfg = {' + obj['configuration'] + '}');
                cfg.fieldLabel = obj['headerText'];
                cfg.name = obj['dataField'];
                cfg.xtype = obj['xtype'];
                cfg.itemId = obj['itemId'];
                cfg.hidden = false;
            }
        } catch (e) {
            //<debug>
            Ext.Error.raise("Error in Ext.ux.filter.Panel's addColumn");
            //</debug>
        }
        var cmp = cfg || {};
        Ext.applyIf(cmp, this.fieldDefaults);

        Ext.Array.forEach(this._items, function (i) {
            if (i.itemId == cmp.itemId) {
                cmp = Ext.merge(i, cmp);
            }
        });

        var colspan = cmp.colspan || 1;
        cmp.width = cmp.width * colspan;
        if (cmp.scope === true) {
            var item = Ext.create('Ext.ux.form.field.DateRange', {
                name: cmp.name,
                itemId: cmp.itemId,
                fieldLabel: cmp.fieldLabel,
                width: 360
            })
            this.add(item);
        } else {
            var item = Ext.ComponentManager.create(cmp);
            this.add(item);


        }
    },
    /**
     *  @protected
     *  获取查询表单的值
     */
    getQuery: function () {
        var querys = [],
            f = 0,
            fields,
            field, val, name, sp;

        fields = this.form.getFields().items;
        for (; f < fields.length; f++) {

            field = fields[f];
            name = field.name;
            val = field.value;
            if (field.xtype == 'gridcombo') {
                val = field.getSubmitValue()[0];
            }
            if (!Ext.isEmpty(val)) {
                var query = {};
                query.name = name;

                if (Ext.isDate(val)) {
                    var values = Ext.Date.format(val, 'Y-m-d H:i:s');
                    query.value = values;
                    query.type = 'date';
                } else if (Ext.isString(val)) {
                    var values;
                    if (Ext.isEmpty(field.isLike) || field.isLike == true) {
                        values = "%" + val.replace("'", "''") + "%";

                    } else if (!Ext.isEmpty(field.isLike) && field.isLike === false) {
                        values = val.replace("'", "''");

                    }
                    query.value = values;
                    query.type = 'string';
                } else if (Ext.isNumber(val)) {
                    query.value = val;
                    query.type = "number";
                } else if (Ext.isBoolean(val)) {
                    query.value = val + '';
                    query.type = 'boolean';
                } else if (Ext.isArray(val)) {
                    Ext.Array.remove(val, null);
                    if (!val.length > 0) {
                        continue;
                    }
                    query.value = val.join(',');
                    query.type = 'string';
                }
                querys.push(query);
            }
        }
        for (var i = 0; i < querys.length; i++) {
            if (Ext.isEmpty(querys[i].value)) {
                querys.remove(i);
            }
        }
        return querys;
    },
    /**
     *  @protected
     *  clear all inputs
     */
    reset: function () {
        //        this.form.reset();
        Ext.suspendLayouts();

        var me = this.form,
            fields = me.getFields().items,
            f,
            fLen = fields.length;
        //不清除已经隐藏的field的值  现阶段作为页面默认filter  不能被清除
        for (f = 0; f < fLen; f++) {
            if (!fields[f].isVisible()) {
                continue;
            }
            fields[f].reset();
        }

        Ext.resumeLayouts(true);
    }
});
Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i];
        }
    }
    this.length -= 1;

};
