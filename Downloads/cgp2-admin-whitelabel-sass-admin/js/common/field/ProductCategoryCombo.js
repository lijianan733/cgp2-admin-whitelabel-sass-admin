/**
 * Created by nan on 2019/4/18.
 */
Ext.Loader.syncRequire([
    'CGP.common.store.ProductCategory',
    'CGP.common.field.WebsiteCombo'
]);
Ext.define('CGP.common.field.ProductCategoryCombo', {
    extend: 'Ext.ux.tree.UxTreeComboHasPaging',
    alias: 'widget.productcategorycombo',
    displayField: 'name',
    valueField: 'id',
    editable: false,
    selectChildren: false,
    canSelectFolders: true,
    width: 325,
    useRawValue: false,
    isLike: true,
    multiselect: false,//默认不是多选
    limit: 25,
    simpleSelect: true,
    infoUrl: adminPath + 'api/productCategories/{id}/detail',//用于查找信息的url
    defaultWebsite: 11,
    isMain: true,//是否查询主目录
    websiteSelectorEditable: true,//选择网站的combo是否可以编辑
    isHiddenRequestParamName: true,//是否隐藏选择查询字段combo
    isHiddenCheckSelected: true,//是否隐藏查看已选的记录的功能,
    websiteSelector: null,//网站选择器
    categorySearcher: null,//类目查询器
    requestParamTriggerConfig: {
        emptyText: '根据类目Id查询',
        vtype: 'diyNumber'
        //stripCharsRe:/*/^[A-Za-z]+$/*//[^0-9]*/
    },//查询搜索框的自定义配置
    doSearch: function () {
        if (this.isValid() == false) {
            return;
        }
        var treePanel = this.ownerCt.ownerCt;
        var requestParamValue = this.getValue();
        var store = treePanel.store;
        var oldParams = store.params;
        if (!Ext.isEmpty(requestParamValue)) {
            store.load({
                params: Ext.Object.merge(store.params, {
                    filter: Ext.JSON.encode([{
                        name: 'id',
                        type: 'number',
                        value: requestParamValue
                    }])
                }),
                callback: function (records) {
                    if (records.length == 0) {
                        Ext.Msg.alert(i18n.getKey('prompt'), '当前网站下无此类目');
                    }
                }
            });
            store.params = oldParams;
        }
    },
    doReset: function () {
        var me = this;
        var treePanel = me.ownerCt.ownerCt;
        me.setValue(null);
        var store = treePanel.store;
        if (me.isValid()) {
            var treePanel = me.ownerCt.ownerCt;
            me.reset();
            delete treePanel.store.params.filter;
            treePanel.store.load({
                    params: treePanel.store.params
                }
            );
        }
    },

    defaultColumnConfig: {
        text: i18n.getKey('name'),
        renderer: function (value, metadata, record) {
            /*      if (record.get('productsInfo'))
                      return value + '-<font color="green">' + record.getId() + '</font>-(' + record.get('productsInfo').total + ')';
                  else*/
            return value + '(<font color="green">' + record.getId() + '</font>)';

        }
    },
    extraColumn: [
        {
            text: i18n.getKey('product') + i18n.getKey('qty'),
            flex: 1,
            dataIndex: 'productsInfo',
            renderer: function (value) {
                return value.total;
            }

        }
    ],

    initComponent: function () {
        var me = this;
        Ext.apply(Ext.form.field.VTypes, {
            diyNumber: function (val, field) {
                return Ext.isNumber(parseInt(val));
            },
            diyNumberText: '请输入正确的id',
            diyNumberMask: /^\d$/
        });
        me.showSelectColumns = [
            {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                flex: 3,
                renderer: function (value, metadata, record) {
                    return value + '(<font color="green">' + record.getId() + '</font>)';

                }
            },
            {
                text: i18n.getKey('product') + i18n.getKey('qty'),
                flex: 1,
                dataIndex: 'productsInfo',
                renderer: function (value) {
                    return value.total;
                }
            }
        ];
        me.store = me.store || Ext.create('CGP.common.store.ProductCategory', {//有专门配置了就使用专门配置的
            params: {
                website: me.defaultWebsite,//默认38
                isMain: me.isMain,
                limit: me.limit
            },
            listeners: {
                load: function (store, node, recrods) {
                    if (recrods && recrods.length > 0) {
                        if (me.multiselect) {
                            recrods.forEach(function (record) {
                                record.set('checked', false);
                            })
                        }
                    }
                }
            }
        });
        me.callParent();

        me.on('afterrender', function (combo) {
            var websiteSelector = combo.websiteSelector = Ext.widget('websitecombo', {
                labelWidth: 50,
                hidden: true,
                readOnly: true,
                labelAlign: 'left',
                value: me.defaultWebsite || 11
            });
            var tbar = combo.tree.getDockedItems('toolbar[dock="top"]')[0];
            combo.categorySearcher = tbar.getComponent('requestParamValue');
            websiteSelector.on('change', function (view, newVal, oldVal) {
                combo.tree.store.params.website = newVal;
                me.reset();//改变选择的网站后清除所有旧的选择
                combo.tree.store.load({
                    params: {
                        website: newVal,
                        isMain: combo.isMain
                    }
                });
            });
            tbar.insert(0, websiteSelector);
        })
    }
})
