/**
 * @Description:
 * @author nan
 * @date 2023/9/12
 */
Ext.define('CGP.orderrefund.view.RefundItemsGridField', {
    extend: 'Ext.ux.form.field.GridFieldExtendContainer',
    alias: 'widget.refund_items_gridfield',
    fieldLabel: i18n.getKey('产品退款'),
    width: 1500,
    name: 'refundItems',
    itemId: 'refundItems',
    valueType: 'idRef',
    hidden: true,
    labelAlign: 'right',
    isFormField: true,
    getErrors: function () {
        var me = this;
        return me.errorInfo;
    },
    isValid: function () {
        var me = this;
        var grid = me._grid;
        var selection = grid.getSelectionModel().getSelection();
        var isValid = true;
        if (me.readOnly == false && me.isVisible() == true) {
            selection.map(function (item) {
                var index = item.index;
                var refundQty = grid.query('[itemId*=refundQty_row_' + index + ']');
                var refundAmount = grid.query('[itemId*=refundAmount_row_' + index + ']');
                refundQty.map(function (refundQtyItem) {
                    me.errorInfo = '有非法输入值';
                    refundQtyItem.isValid() == false ? isValid = false : null;
                });
                refundAmount.map(function (refundAmountItem) {
                    me.errorInfo = '有非法输入值';
                    refundAmountItem.isValid() == false ? isValid = false : null;
                });
            });
            if (selection.length == 0) {
                me.errorInfo = '产品退款数量不能为空';
                isValid = false;
            }
        }
        if (isValid == true) {
            me.activeError = me.errorInfo = '';
            me.unsetActiveError();
        } else {
            me.setActiveErrors(me.errorInfo);
        }
        return isValid;
    },
    setFieldStyle: function () {
    },
    diySetValue: function (data) {
        var me = this;
        var grid = me._grid;
        if (data) {
            grid.store.proxy.data = data;
            grid.store.load();
        }
        var records = [];
        grid.store.each(function (record) {
            if (record.get('refundQty') > 0) {
                records.push(record);
            }
        });
        //选中有退款的订单项
        if (grid.rendered == true) {
            grid.getSelectionModel().select(records);
        } else {
            grid.on('afterrender', function () {
                //不知道为啥,得一段时间后才触发select事件
                setTimeout(function () {
                    grid.getSelectionModel().select(records);
                }, 100);
            })
        }
    },
    diyGetValue: function () {
        var me = this;
        var type = me.ownerCt.getComponent('type').getValue();
        var grid = me._grid;
        if (type == 'FullOrder') {
            //全单退款时,直接根据可提款订单项信息直接返回
            var result = [];
            var allowRefundItems = me.ownerCt.allowRefundItems;
            allowRefundItems.map(function (item) {
                result.push({
                    "orderItemId": item.saleOrderItemId,
                    "refundAmount": item.qty * item.retailPrice,
                    "refundQty": item.qty
                })
            })
            return result;

        } else if (type == 'Product') {
            //退部分产品
            var selection = grid.getSelectionModel().getSelection();
            var result = [];
            selection.map(function (item) {
                var orderItemId = item.get('id');
                var index = item.index;
                var refundQty = grid.query('[itemId*=refundQty_row_' + index + ']')[0];
                var refundAmount = grid.query('[itemId*=refundAmount_row_' + index + ']')[0];
                result.push({
                    "orderItemId": orderItemId,
                    "refundAmount": refundAmount.getValue(),
                    "refundQty": refundQty.getValue()
                });
            });
            return result;
        } else {
            return null;
        }

    },
    setReadOnly: function (tag) {
        var me = this;
        if (me.rendered == true) {
            var grid = me._grid;
            grid.readOnly = tag;
            var refundQtys = grid.query('[itemId*=refundQty_row_]');
            refundQtys.map(function (item) {
                item.setReadOnly(grid.readOnly);
            });
            var refundAmounts = grid.query('[itemId*=refundAmount_row_]');
            refundAmounts.map(function (item) {
                item.setReadOnly(grid.readOnly);
            });
        } else {

        }
    },
    //选中时,直接注入最大值
    //修改数量时动态计算运费

    initComponent: function () {
        var me = this;
        var currencyCode = me.currencyCode;
        me.gridConfig = {
            autoScroll: true,
            store: {
                xtype: 'store',
                model: 'CGP.orderrefund.model.OrderItemModel',
                data: me.allOrderItems,
                proxy: {
                    type: 'memory'
                }
            },
            viewConfig: {
                onRowSelect: function (rowIdx) {
                    var me = this;
                    me.addRowCls(rowIdx, me.selectedItemCls);
                    if (me.isRowStyleFirst(rowIdx)) {
                        me.getRowStyleTableEl(rowIdx).addCls(me.tableSelectedFirstCls);
                    } else {
                        me.addRowCls(rowIdx - 1, me.beforeSelectedItemCls);
                    }
                },
            },
            readOnly: !Ext.isEmpty(JSGetQueryString('_id')),
            selModel: Ext.create("Ext.selection.CheckboxModel", {
                mode: "simple",//multi,simple,single,默认为多选multi
                checkOnly: true,//如果值为true，则只用点击checkbox列才能选中此条记录
            }),
            columns: {
                defaults: {
                    menuDisabled: true,
                    sortable: false,
                    width: 100,
                },
                items: [
                    {
                        text: i18n.getKey('seqNo'),
                        dataIndex: 'seqNo',
                        width: 50
                    },
                    {
                        dataIndex: 'productImageUrl',
                        text: i18n.getKey('preview'),
                        xtype: 'componentcolumn',
                        width: 120,
                        renderer: function (value, metadata, record) {
                            var thumbnailInfo = record.get('thumbnailInfo');
                            var status = thumbnailInfo?.status;
                            var thumbnail = thumbnailInfo?.thumbnail;
                            if (['', undefined].includes(thumbnail) && status !== 'FAILURE') {
                                status = 'NULL'
                            }
                            var statusGather = {
                                SUCCESS: function () {
                                    return projectThumbServer + thumbnail;
                                },
                                FAILURE: function () {
                                    return path + 'js/order/view/orderlineitem/image/FAILURE.jpg'
                                },
                                WAITING: function () {
                                    return path + 'js/order/view/orderlineitem/image/WAITING.gif'
                                },
                                NULL: function () {
                                    return path + 'js/order/view/orderlineitem/image/NULL.jpg'
                                }
                            }
                            var imageUrl = statusGather[status]();
                            if (status) {
                                return {
                                    xtype: 'imagecomponent',
                                    src: imageUrl,
                                    autoEl: 'div',
                                    tdCls: 'vertical-middle',
                                    style: 'cursor: pointer',
                                    width: 100,
                                    height: 100,
                                    imgCls: 'imgAutoSize',
                                    listeners: {
                                        afterrender: function (view) {
                                            if (thumbnail) {
                                                Ext.create('Ext.ux.window.ImageViewer', {
                                                    imageSrc: imageUrl,
                                                    actionItem: view.el.dom.id,
                                                    winConfig: {
                                                        title: '查看图片'
                                                    },
                                                    viewerConfig: null,
                                                });
                                            }
                                        }
                                    }
                                };
                            }
                        }
                    },
                    {
                        dataIndex: 'productName',
                        text: i18n.getKey('product'),
                        width: 250,
                        renderer: function (value, metadata, record) {
                            var model = record.get('productModel');
                            var sku = record.get("productSku");
                            var items = [{
                                title: i18n.getKey('name'),
                                value: value
                            }, {
                                title: i18n.getKey('model'),
                                value: model
                            }, {
                                title: 'Sku',
                                value: sku
                            }];
                            return JSCreateHTMLTable(items);
                        }
                    },
                    {
                        text: i18n.getKey('单价'),
                        dataIndex: 'productPrice',
                        width: 100,
                        renderer: function (value, metaData, record) {
                            return Number(value).toLocaleString('zh', {
                                style: 'currency',
                                currency: currencyCode
                            });
                        }
                    },
                    {
                        text: i18n.getKey('重量(g)'),
                        dataIndex: 'productWeight',
                        width: 100,
                    },
                    {
                        text: i18n.getKey('成本'),
                        dataIndex: 'productCosting',
                        width: 100,
                        renderer: function (value, metaData, record) {
                            if (!Ext.isEmpty(value)) {
                                return Number(value).toLocaleString('zh', {
                                    style: 'currency',
                                    currency: 'USD'
                                });
                            }
                        }
                    },
                    {
                        text: i18n.getKey('产品总价'),
                        width: 100,
                        dataIndex: 'totalproductPrice',
                        renderer: function (value, metaData, record) {
                            return Number(value).toLocaleString('zh', {
                                style: 'currency',
                                currency: currencyCode
                            });
                        }
                    },
                    {
                        text: i18n.getKey('可退产品数'),
                        dataIndex: 'allowRefundQty',
                        width: 100,
                        hidden: !Ext.isEmpty(JSGetQueryString('_id')),
                    },
                    {
                        text: i18n.getKey('可退产品金额'),
                        width: 100,
                        hidden: !Ext.isEmpty(JSGetQueryString('_id')),
                        renderer: function (value, mete, record, rowIndex, colIndex, store, gridView) {
                            var account = record.raw.allowRefundQty * record.raw.productPrice;
                            return Number(account).toLocaleString('zh', {
                                style: 'currency',
                                currency: currencyCode
                            });
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        text: i18n.getKey('退款数量'),
                        dataIndex: 'refundQty',
                        width: 150,
                        renderer: function (value, mete, record, rowIndex, colIndex, store, gridView) {
                            var productPrice = record.get('productPrice');
                            if (!Ext.isEmpty(JSGetQueryString('_id'))) {
                                return {
                                    xtype: 'displayfield',
                                    itemId: 'refundQty_row_' + rowIndex,
                                    value: Number(value)
                                }
                            } else {
                                return {
                                    xtype: 'numberfield',
                                    value: value,
                                    minValue: 1,
                                    allowDecimal: false,
                                    vtype: 'maxValue',
                                    allowBlank: false,
                                    maxValue: record.raw.allowRefundQty,
                                    itemId: 'refundQty_row_' + rowIndex,
                                    readOnly: true,
                                    fieldStyle: true ? 'background-color: silver' : null,//设置文本框的样式
                                    listeners: {
                                        change: function (field, newValue, oldValue) {
                                            var form = gridView.ownerCt.ownerCt.ownerCt;
                                            var grid = gridView.ownerCt;
                                            if (field.isValid()) {
                                                //計算运费
                                                form.fireEvent('productQtyChange', grid);
                                                //改变总价
                                                var totalAccount = Number((newValue * productPrice).toFixed(2));
                                                var refundAmount = grid.query('[itemId*=refundAmount_row_' + rowIndex + ']')[0];
                                                refundAmount.setValue(totalAccount);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        text: i18n.getKey('退款总额'),
                        dataIndex: 'refundAmount',
                        minWidth: 150,
                        renderer: function (value, mete, record, rowIndex, colIndex, store, gridView) {
                            if (!Ext.isEmpty(JSGetQueryString('_id'))) {
                                return {
                                    xtype: 'displayfield',
                                    itemId: 'refundAmount_row_' + rowIndex,
                                    value: Number(value).toLocaleString('zh', {
                                        style: 'currency',
                                        currency: currencyCode
                                    }),
                                }
                            } else {
                                return {
                                    xtype: 'numberfield',
                                    itemId: 'refundAmount_row_' + rowIndex,
                                    readOnly: true,
                                    value: value,
                                    minValue: 1,
                                    vtype: 'maxValue',
                                    allowBlank: false,
                                    maxValue: (record.raw.allowRefundQty * record.raw.productPrice),
                                    fieldStyle: true ? 'background-color: silver' : null,//设置文本框的样式
                                    listeners: {
                                        change: function (field, newValue, oldValue) {
                                            var form = gridView.ownerCt.ownerCt.ownerCt;
                                            var grid = gridView.ownerCt;
                                            form.fireEvent('productRefundChange', grid);
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            listeners: {
                beforeselect: function () {
                    return !this.readOnly;
                },
                beforedeselect: function () {
                    return !this.readOnly;
                },
                select: function (selectModel, record, rowIndex) {
                   ;
                    var grid = selectModel.view.ownerCt;
                    var form = grid.ownerCt.ownerCt;
                    var refundQty = grid.query('[itemId*=refundQty_row_' + rowIndex + ']')[0];
                    var refundAmount = grid.query('[itemId*=refundAmount_row_' + rowIndex + ']')[0];
                    refundQty?.setReadOnly(false);
                    refundAmount?.setReadOnly(false);
                    refundQty?.setDisabled(false);
                    refundAmount?.setDisabled(false);
                    refundQty?.setFieldStyle('background-color: white');
                    refundAmount?.setFieldStyle('background-color: white');
                    refundQty?.setValue(record.get('allowRefundQty'));
                    refundAmount?.setValue(record.get('allowRefundQty') * record.get('productPrice'));
                    grid.ownerCt.isValid();
                    /*    form.fireEvent('productRefundChange', grid);
                        form.fireEvent('productQtyChange', grid);*/
                },
                deselect: function (selectModel, record, rowIndex) {
                    var grid = selectModel.view.ownerCt;
                    var form = grid.ownerCt.ownerCt;
                    var refundQty = grid.query('[itemId*=refundQty_row_' + rowIndex + ']')[0];
                    var refundAmount = grid.query('[itemId*=refundAmount_row_' + rowIndex + ']')[0];
                    refundQty?.setReadOnly(true);
                    refundAmount?.setReadOnly(true);
                    refundQty?.setDisabled(true);
                    refundAmount?.setDisabled(true);
                    refundQty?.setFieldStyle('background-color: silver');
                    refundAmount?.setFieldStyle('background-color: silver');
                    refundQty.setValue();
                    refundAmount.setValue();
                    grid.ownerCt.isValid();
                    /*form.fireEvent('productRefundChange', grid);
                    form.fireEvent('productQtyChange', grid);*/
                }
            }
        };
        me.callParent(arguments);
    }
})