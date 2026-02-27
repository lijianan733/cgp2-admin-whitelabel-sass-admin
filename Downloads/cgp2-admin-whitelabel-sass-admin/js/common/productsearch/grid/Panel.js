/**
 * @class 展示产品信息的表格，已封装产品信息字段（产品名称，产品编号，类型，sku，模型，主类目，产品类目）
 *
 */
Ext.define('CGP.common.productsearch.grid.Panel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.uxproductgrid'

    ,
    mixins: {
        configurable: 'Ext.ux.util.Configurable'
    }

    ,
    cfgModel: 'Ext.ux.configuation.ViewConfigModel'

    /**
     *  @cfg {Object} gridText
     *  textResource
     */
    ,
    gridText: {
        deleteConfirm: 'Confirm to delete?',
        deleteSelectedComfirm: 'Confirm to delete selected?',
        comfirmCaption: 'Confirm',
        deleteSuccess: 'Delete Successfully',
        edit: 'Edit',
        destroy: 'destroy',
        deleteFailure: 'Delete Failure',
        prompt: 'prompt',
        type: 'Type',
        sku: 'SKU',
        name: 'Name',
        model: 'Model',
        maincategory: 'MainCategory',
        subCategories: 'SubCategory',
        website: 'website',
        id: 'id'
    }

    /* @cfg default configurations */
    ,
    config: {
        header: false,
        /**
         * @cfg {Boolean} 是否显示产品序号
         */
        showRowNum: true,
        editActionHandler: Ext.emptyFn,
        /**
         * @cfg {Object} 行默认属性
         */
        columnDefaults: {},
        columns: [{}],
        filter: {},
        /**
         * @cfg {Boolean} 显示分页工具栏
         */
        pagingBar: true,
        multiSelect: true,
        /**
         * @cfg {selType} 选择模型的xtype
         */
        selType: 'checkboxmodel',
        editDisabled: Ext.emptyFn,
        deleteDisabled: Ext.emptyFn
    },
    constructor: function (config) {
        var me = this;
        initResource(me.gridText);
        //config.store = Ext.create("CGP.common.productsearch.store.ProductStore");
        me.initConfig(config);
        me._columns = config.columns;
        config.columns = []; //在oadConfigData中重新生成columns


        me.callParent(arguments);
        me.getStore().on('beforeload', function () {
            var p = me.getStore().getProxy();
            if (Ext.isEmpty(p.filter)) {
                p.filter = me.filter;
            }
        })
        /*var p = me.getStore().getProxy();
         if (Ext.isEmpty(p.filter)){
         p.filter = me.filter;
         }*/
        if (me.remoteCfg && (me.cfgStore || me.cfgProxy || me.cfgData)) {
            me.loadConfig();
        } else {
            var data = [];
            if (me._columns != null) {
                Ext.Array.forEach(me._columns, function (c) {
                    //add defaults attribute
                    if (Ext.isObject(me.config.columnDefaults) && !Ext.Object.isEmpty(me.config.columnDefaults)) {
                        c = Ext.apply(Ext.clone(me.config.columnDefaults), c);
                    }

                    data.push({
                        data: {
                            configuration: c
                        }
                    });
                });
            }

            me.loadConfigData(data);

        }
    },

    initComponent: function () {

        var me = this;
        if (me.tbar)
            me.tbar = Ext.widget(me.tbar);
        if (me.pagingBar) {
            me.dockedItems = me.dockedItems || [];
            me.dockedItems.push({
                xtype: 'pagingtoolbar',
                store: me.getStore(), // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true,
                height: 40,
                inputItemWidth: 45,
                width: 500
            });
        }

        me.callParent(arguments);

    },
    /**
     *  @protected
     */
    loadConfigData: function (records) {
        var me = this,
            column = [];
        if (me.config.showRowNum)
            column.push({
                xtype: 'rownumberer',
                autoSizeColumn: false,
                itemId: 'rownumberer',
                width: 45,
                resizable: true,
                menuDisabled: true,
                tdCls: 'vertical-middle'
            });
        var originalColumns = [{
                text: me.gridText.id,
                dataIndex: 'id',
                width: 80,
                itemId: 'id'
            }, {
                text: me.gridText.type,
                dataIndex: 'type',
                sortable: false,
                xtype: 'gridcolumn',
                itemId: 'type'
            },
                {
                    text: me.gridText.sku,
                    dataIndex: 'sku',
                    autoSizeColumn: false,
                    width: 150,
                    fieldLabel: 'SKU',
                    sortable: false,
                    xtype: 'gridcolumn',
                    itemId: 'sku',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value
                    }
                },
                {
                    text: me.gridText.name,
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    width: 150,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value
                    }
                },
                {
                    text: me.gridText.model,
                    dataIndex: 'model',
                    xtype: 'gridcolumn',
                    width: 150,
                    itemId: 'model',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value
                    }
                },
                {
                    text: me.gridText.maincategory,
                    dataIndex: 'mainCategory',
                    xtype: 'gridcolumn',
                    itemId: 'mainCategory',
                    width: 150,
                    renderer: function (mainCategory, metadata) {
                        metadata.tdAttr = 'data-qtip="' + mainCategory.name + '"';
                        return mainCategory.name;
                    }
                }, {
                    text: me.gridText.subCategories,
                    dataIndex: 'subCategories',
                    xtype: 'gridcolumn',
                    minWidth: 100,
                    flex: 1,
                    itemId: 'subCategories',
                    renderer: function (subCategories, metadata) {
                        var value = [];
                        Ext.Array.each(subCategories, function (subCategory) {
                            value.push(subCategory.name);

                        })
                        metadata.tdAttr = 'data-qtip="' + value.join(",") + '"';
                        return value.join(",");
                    }
                }],
            headerCt = me.headerCt;
        var columns = Ext.Array.merge(column, originalColumns);
        Ext.each(records, function (item) {

            columns.push(Ext.merge(me.getColumn(item.data), {
                menuDisabled: true
            }));
        }, this);
        me.reconfigure(null, columns);
    }

    ,
    showConfigError: function (msg) {
        var item = Ext.ComponentManager.create({
            html: '<span>' + this.configErrorText + ':<br/>' + msg + '</span>',
            dock: 'top'
        }, 'container');
        this.addDocked(item);
    }

    /**
     *  @protected
     */
    ,
    getColumn: function (obj) {
        var cfg;
        try {
            if (Ext.isObject(obj['configuration']))
                cfg = obj['configuration'];
            else {
                eval('cfg = {' + obj['configuration'] + '}');
                cfg.text = obj['headerText'];
                cfg.dataIndex = obj['dataField'];
                cfg.xtype = obj['xtype'];
                cfg.itemId = obj['itemId'];
                cfg.hidden = !obj['visible'];
            }
        } catch (e) {
            //<debug>
            Ext.Error.raise("Error in Ext.ux.grid.Panel's getColumn");
            //</debug>
        }
        return cfg;
    }

});
