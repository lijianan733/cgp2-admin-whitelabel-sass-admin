/**
 * Created by nan on 2020/7/29.
 */
Ext.Loader.syncRequire([
    'CGP.editviewtypeconfigv3.store.EditViewConfigStore',
    'CGP.editviewtypeconfigv3.model.EditViewConfigModel'
]);
Ext.onReady(function () {
    // 用户的grid数据展示页面
    var store = Ext.create("CGP.editviewtypeconfigv3.store.EditViewConfigStore");
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('editViewTypeConfig'),
        block: 'editviewtypeconfigv3',
        // 编辑页面
        editPage: 'edit.html',
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            viewConfig: {
                enableTextSelection: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    width: 100,
                    xtype: 'gridcolumn',
                    itemId: 'id',
                },
                {
                    text: i18n.getKey('editViewTypeDomainId'),
                    dataIndex: 'editViewTypeDomain',
                    width: 170,
                    xtype: 'gridcolumn',
                    itemId: 'editViewTypeDomainId',
                    renderer:function(value){
                        return value._id;
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 200,
                    xtype: 'gridcolumn',
                    itemId: 'description'
                },
                {
                    text: i18n.getKey('使用的区域'),
                    dataIndex: 'areas',
                    flex: 1,
                    itemId: 'areas',
                    renderer: function (value, mateData, record) {
                        var resultStr = '';
                       ;
                        for (var i = 0; i < value.length; i++) {
                            resultStr += value[i].layoutPosition;
                            if (i != value.length - 1) {
                                resultStr += ','
                            }
                        }
                        return resultStr;
                    }
                }

            ]
        },
        filterCfg: {
            minHeight: 125,
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'editViewTypeDomain._id',
                    name: 'editViewTypeDomain._id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('editViewType DomainId'),
                    itemId: 'editViewTypeDomainId'
                },
                {
                    id: 'description',
                    name: 'description',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                }
            ]
        }
    });
});
