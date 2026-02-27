/**
 * @Description:
 * @author nan
 * @date 2022/2/14
 */
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.Order',
])
Ext.Loader.setConfig({
    paths: {
        'CGP.order': path + 'js/order'
    },
    disableCaching: false
});
Ext.define('CGP.orderstatusmodify.controller.Controller', {
    /**
     *修改状态,状态变成122,106的需要自动打印label
     */
    updateConfig: function (data, form) {
        var controller = this;
        var orderId = JSGetQueryString('id');
        var orderNumber = JSGetQueryString('orderNumber');
        var nextOrderStatus = data.data.statusId;
        form.setLoading(true);
        var url = adminPath + 'api/orders/' + orderId + '/stateInstances';
        setTimeout(function () {
            JSAjaxRequest(url, 'POST', false, data, i18n.getKey('操作') + i18n.getKey('success'), function (require, success, response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                form.setLoading(false);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('操作') + i18n.getKey('success'), function () {
                        controller.loadOrderData(orderId, form);
                        //106时自动打印一次label
                        if (nextOrderStatus == 106) {
                            var orderController = Ext.create('CGP.order.controller.Order');
                            orderController.printLabel(orderNumber);
                        }
                    });
                }
            });
        });
    },
    /**
     * 加载指定订单数据
     * @param orderId
     * @param form
     */
    loadOrderData: function (orderId, form) {
        var result = [];
        JSAjaxRequest(adminPath + 'api/orders/' + orderId + '/v2', "GET", false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var model = new CGP.order.model.Order(responseText.data);
                    form.refreshData(model);
                    result = responseText.data
                }
            }
        })
        return result;
    },

    getQuery: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                }
            }
        })
        return data;
    },


    // 用状态排行排队状态前后
    findValueByField: function (array, field, isFindMax) {
        if (array.length === 0) {
            return undefined; // 或者其他适当的默认值
        }

        return array.reduce((extremeObj, currentObj) => {
            if (isFindMax) {
                return currentObj[field] > extremeObj[field] ? currentObj : extremeObj;
            } else {
                return currentObj[field] < extremeObj[field] ? currentObj : extremeObj;
            }
        });
    },


// 获取状态名
    getStatusName: function (record) {
        var result = null,
            shipmentOrder = record.get('shipmentOrder');

        if (shipmentOrder) {
            var {status} = shipmentOrder,
                {frontendName, id} = status;
            if (id === 101) {
                frontendName = '待装箱'
            }

            result = {
                name: i18n.getKey(frontendName),
                id: id
            };
        } else {
            result = {
                name: '等待发货',
                id: null
            };
        }

        return result;
    },

    getNewStatusName: function (record) {
        var result = null,
            shipmentOrders = record.get('shipmentOrders'),
            shipmentOrder = shipmentOrders.filter(item => {
                return item['manufactureCenter'] === JSGetQueryString('manufactureCenter')
            })

        if (shipmentOrder[0]) {
            var {status} = shipmentOrder[0],
                {frontendName, id} = status;
            if (id === 101) {
                frontendName = '待装箱'
            }

            result = {
                name: i18n.getKey(frontendName),
                id: id
            };
        } else {
            result = {
                name: '等待发货',
                id: null
            };
        }

        return result;
    },

    getStatusName2: function (record) {
        var controller = this,
            result = '等待发货',
            shipmentRequirement = record.get('shipmentRequirement'),
            shipmentOrders = record.get('shipmentOrders'),
            {manufactureCenters} = shipmentRequirement,
            statusArray = [];

        shipmentOrders.forEach(item => {
            statusArray.push(item['status']);
        })

        if (statusArray.length === 1) { //生成一个 已部分发货
            result = '已部分发货';
        }

        if (statusArray.length === 2) { //生成两个取最低状态
            var {frontendName} = controller.findValueByField(statusArray, 'sortOrder');
            result = frontendName;
        }

        return result;
    },

    /**
     * 接口检查所有订单项上报关分类是否确定了
     */
    checkCustomElementComplete: function (orderID) {
        var controller = Ext.create('Order.status.controller.Status');
        var result = controller.checkCustomElementComplete(orderID);
        return result;
    },
    /**
     * 本地校验报关信息
     * 根据订单项里面的isCustomsClearance为true
     * 和categoryId来进行判断
     */
    checkCustomInfo: function (form) {
        var contoller = this;
        var isComplete = true;
        var orderItem = form.getComponent('orderLineInfo');
        var infoDisplayToolbar = orderItem.down('[itemId=infoDisplayToolbar]');
        var unConfirmItem = orderItem.unConfirmItem;
        if (unConfirmItem.getCount() > 0) {
            isComplete = false;
            var items = [];
            unConfirmItem.items.map(function (record) {
                var seqNo = record.get('seqNo');
                items.push({
                    xtype: 'atag_displayfield',
                    value: `序号(${seqNo})`,
                    record: record,
                    itemId: `categoryDisplayInfo_${seqNo}`,
                    clickHandler: function () {
                        var field = this,
                            grid = orderItem.getGrid();
                        grid.getSelectionModel().deselectAll(true);
                        grid.getSelectionModel().select(field.record);
                    }
                });
            });
            infoDisplayToolbar.add([{
                xtype: 'displayfield',
                margin: '0 0 0 50',
                itemId: 'categoryDisplayInfo',
                value: '<font color="red" style="font-weight: bold">需选定报关分类的订单项：</font>'
            }, ...items]);
        } else {
            isComplete = true;
            var compArr = infoDisplayToolbar.query('[itemId*=categoryDisplayInfo]');

            if (compArr && compArr.length > 0) {
                infoDisplayToolbar.remove(compArr);
            }
        }
        var listeners = orderItem.store?.events['datachanged'].listeners;
        var isExtra = false;
        listeners.find(function (item) {
            if (item.fn.name == 'eventHandler') {
                isExtra = true;
            }
        });
        if (isExtra == false) {
            var eventHandler = function () {
                contoller.checkCustomInfo(form);
            };
            orderItem.store.on('datachanged', eventHandler);
        }
        return isComplete;
    },

    getManufactureCenterText: function (code) {
        var result = {
                text: '',
                color: '',
                btnBackgroundColor: []
            },
            newCode = code || 'PL0001';
        if (newCode) {
            var manufactureCenterGather = {
                PL0003: {
                    text: '越南',
                    color: 'green',
                    btnBackgroundColor: ['#4caf50', '#43a047', '#388e3c', '#43a047'],
                },
                PL0002: {
                    text: '美国',
                    color: 'orange',
                    btnBackgroundColor: ['#4b9cd7', '#3892d3', '#358ac8', '#3892d3'],
                },
                PL0001: {
                    text: '东莞',
                    color: '#358ac8',
                    btnBackgroundColor: ['#4b9cd7', '#3892d3', '#358ac8', '#3892d3'],
                }
            }

            result = manufactureCenterGather[newCode];
        }
        return result;
    },

    // 动态生成销售详情按钮
    getShippingDetailsBtn: function (data, params) {
        var controller = this,
            result = [],
            {
                remark = '',
                orderId,
                statusName,
                statusId,
                shippingDetailsId,
                orderDeliveryMethod
            } = params;

        if (data) {
            data?.forEach(code => {
                var {text, color, btnBackgroundColor} = controller.getManufactureCenterText(code);
                result.push({
                    xtype: 'button',
                    margin: '5 0',
                    text: i18n.getKey(`发货详情(${text})`),
                    itemId: 'shippingDetails' + code,
                    tooltip: `查看_发货详情(${text})`,
                    style: `background-image: -webkit-gradient(linear,
                  50% 0, 50% 100%, color-stop(0%, ${btnBackgroundColor[0]}), 
                  color-stop(50%, ${btnBackgroundColor[1]}),
                   color-stop(51%, ${btnBackgroundColor[2]}),
                    color-stop(100%, ${btnBackgroundColor[3]}));
                     border-color:${btnBackgroundColor[0]};
                      color: #fff;`,//渐变
                    handler: function (btn) {
                        JSOpen({
                            id: 'sanction',
                            url: path + "partials/orderstatusmodify/multipleAddress.html?id=" + orderId +
                                '&shippingDetailsId=' + shippingDetailsId +
                                '&status=' + statusName +
                                '&statusId=' + statusId +
                                '&orderStatusId=' + JSGetQueryString('statusId') +
                                '&orderDeliveryMethod=' + orderDeliveryMethod +
                                '&manufactureCenter=' + code +
                                '&remark=' + remark,
                            title: '发货详情',
                            refresh: true
                        });
                    }
                },)
            });
        } else {
            result.push({
                xtype: 'button',
                margin: '5 0',
                text: i18n.getKey(`发货详情`),
                itemId: 'shippingDetails',
                tooltip: `查看_发货详情`,
                handler: function (btn) {
                    JSOpen({
                        id: 'sanction',
                        url: path + "partials/orderstatusmodify/multipleAddress.html?id=" + orderId +
                            '&shippingDetailsId=' + shippingDetailsId +
                            '&status=' + statusName +
                            '&statusId=' + statusId +
                            '&orderStatusId=' + JSGetQueryString('statusId') +
                            '&orderDeliveryMethod=' + orderDeliveryMethod +
                            '&remark=' + remark,
                        title: '发货详情',
                        refresh: true
                    });
                }
            })
        }

        return result;
    },

    asyncEditQuery: function (url, jsonData, isEdit, callFn, hideMsg, attributeVersionId) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, attributeVersionId);
    },

    verifyManufactureCenterQuery: function (shippingDetailsId, productLocation, callBack) {
        var controller = this,
            url = adminPath + `api/shipmentRequirements/${shippingDetailsId}/manufacture-center/${productLocation}/check`;

        controller.asyncEditQuery(url, null, true, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    const dara = responseText?.data;
                    if (dara?.length) { //存在越南不可生产的单时 提示是否强行推单
                        callBack && callBack(dara)
                    }
                }
            }
        }, true)

    },

    editManufactureCenterQuery: function (shippingDetailsId, productLocation, callBack) {
        var controller = this,
            url = adminPath + `api/shipmentRequirements/${shippingDetailsId}/manufactureCenter?manufactureCenter=${productLocation}`;

        controller.asyncEditQuery(url, null, true, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText),
                    data = responseText?.data;

                if (responseText.success) {
                    console.log(data);
                    callBack && callBack(data)
                } else {
                    var code = data?.code,
                        message = data?.message,
                        // 不可改生产基地的code
                        codeArray = [38000010, 38000012],
                        isNoEditManufactureCenter = codeArray.includes(code),
                        codeGather = {
                            38000010: '发货要求中有产品已经生产完毕,无法更改生产基地',
                            38000012: '发货要求中有产品正在生产,无法更改生产基地',
                        },
                        newMassage = isNoEditManufactureCenter ? codeGather[code] : message;

                    Ext.Msg.alert('提示', newMassage);
                }
            }
        }, true)
    },

    getAddressFlagStatus: function (singleAddressDeliveryDetails) {
        var addressFlagGather = {
            0: false,
            1: false
        };

        singleAddressDeliveryDetails.forEach(item => {
            const {addressFlag, supplier, sanctionCheckResult} = item;
            if (sanctionCheckResult) {
                var {hits, count} = sanctionCheckResult,
                    supplierTypeGather = {
                        QPSON: function () {
                            if (hits?.length) {
                                addressFlagGather[addressFlag] = true
                            }
                        },
                        COMPLYADVANTAGE: function () {
                            if (hits?.length) {
                                addressFlagGather[addressFlag] = true
                            }
                        },
                        SANCTIONSIO: function () {
                            if (count) {
                                addressFlagGather[addressFlag] = true
                            }
                        },
                    };

                supplierTypeGather[supplier || 'QPSON']();
            }
        });

        return addressFlagGather;
    },

    jumpJSOpenV1: function (type, singleAddressDeliveryDetails, deliveryAddress, orderId, shippingDetailsId) {
        var {firstName, lastName} = deliveryAddress,
            typeGather = {
                shippingAddress: {
                    pageId: 'sanction_shippingAddress',
                    title: '收件人制裁详细',
                    addressFlag: 1
                },
                billAddress: {
                    pageId: 'sanction_billAddress',
                    title: '账单用户制裁详细',
                    addressFlag: 0
                }
            },
            {pageId, title, addressFlag} = typeGather[type],
            address = singleAddressDeliveryDetails.filter(item => {
                return item['addressFlag'] === addressFlag;
            })[0],
            {supplier, sanctionCheckResult} = address,
            supplierTypeGather = {
                QPSON: function () {
                    JSOpen({
                        id: pageId,
                        url: path + "partials/orderstatusmodify/sanction.html?id=" + orderId
                            + '&addressFlag=' + addressFlag
                            + '&userName=' + lastName + firstName
                            + '&shippingDetailsId=' + shippingDetailsId,
                        title: title,
                        refresh: true
                    });
                },
                COMPLYADVANTAGE: function () {
                    JSOpen({
                        id: pageId,
                        url: path + "partials/orderstatusmodify/sanction.html?id=" + orderId
                            + '&addressFlag=' + addressFlag
                            + '&userName=' + lastName + firstName
                            + '&shippingDetailsId=' + shippingDetailsId,
                        title: title,
                        refresh: true
                    });
                },
                SANCTIONSIO: function () {
                    JSOpen({
                        id: pageId,
                        url: path + "partials/orderstatusmodify/HtmlPage2.html?id=" + orderId
                            + '&addressFlag=' + addressFlag
                            + '&userName=' + lastName + firstName
                            + '&shippingDetailsId=' + shippingDetailsId,
                        title: title,
                        refresh: true
                    });
                },
            };

        supplierTypeGather[supplier || 'QPSON']();
    },

    getAddressDeliveryDetail: function () {
        var controller = this,
            id = JSGetQueryString('id'),
            shippingDetailsId = JSGetQueryString('shippingDetailsId'),
            url = shippingDetailsId ?
                adminPath + 'api/order/shipmentRequirement/' + shippingDetailsId + '/addressHitsDetail' :
                adminPath + 'api/order/' + id + '/singleAddressDeliveryDetail',
            data = controller.getQuery(url);
        return data;
    },

    /**
     * 转换时间格式
     * @param time 时间
     */
    getEndTime: function (time) {
        if (!time) {
            return ''
        }
        return Ext.Date.format(new Date(+time), 'Y-m-d G:i:s')
    },

    /**
     * 转换时间格式
     * @param timeDiff 毫秒
     */
    getTimeDiffType: function (timeDiff) {
        var minute = null,
            hour = null,
            day = null,
            millisecond = (timeDiff % 1000).toFixed(0),
            second = Math.floor(timeDiff / 1000);

        if (second > 60) {
            minute = Math.floor(second / 60);
            second %= 60;
        }
        if (minute > 60) {
            hour = Math.floor(minute / 60);
            minute %= 60;
        }
        if (hour > 24) {
            day = Math.floor(hour / 24);
            hour %= 24;
        }

        var groupTime = '';
        if (day > 0) {
            groupTime = day + '天 ' + hour + '小时 ' + minute + '分 ' + second + '秒 ';
        } else if (hour > 0) {
            groupTime = hour + '小时 ' + minute + '分 ' + second + '秒 ';
        } else if (minute > 0) {
            groupTime = minute + '分 ' + second + '秒 ';
        } else if (second > 0) {
            groupTime = second + '秒 ';
        } else {
            groupTime = millisecond + '毫秒 ';
        }

        return groupTime;
    },

    // 集合排版内所有的子任务
    getAllItemSubTasks: function (composingJobArr) {
        var allItemSubTasks = [];
        composingJobArr.forEach(item => {
            allItemSubTasks = Ext.Array.merge(allItemSubTasks, item['subTasks']);
        })
        return allItemSubTasks;
    },

    // 获取过滤对应key的子任务
    getFilterKeySubTask: function (array, key, type) {
        return array.filter(item => { //大版生成
            return item[key] === type;
        });
    },

    // 获取对应类型子任务的所有总用时
    getAllSubTasksTimeMs: function (array) {
        var controller = this,
            waitingTimeMsTotal = 0,
            runningTimeMsTotal = 0;

        array.forEach(item => {
            var {waitingTimeMs, runningTimeMs} = item;

            waitingTimeMsTotal += waitingTimeMs;
            runningTimeMsTotal += runningTimeMs;
        })

        return {
            waitingTimeMsTotal: controller.getTimeDiffType(waitingTimeMsTotal),
            runningTimeMsTotal: controller.getTimeDiffType(runningTimeMsTotal),
        };
    },
    /**
     * 订单解除因为信贷额的锁定
     */
    unLockOrder: function (orderId,) {
        Ext.Msg.confirm('提醒', '因超信贷额度，该订单已被锁定! 是否确认解锁当前订单?', function (selector) {
            if (selector == 'yes') {
                var url = adminPath + `api/partner/orders/${orderId}/unlock`;
                JSAjaxRequest(url, 'PUT', true, {
                    remark: ''
                }, null, function (require, success, response) {
                    if (success) {
                        var responseText = Ext.JSON.decode(response.responseText);
                        if (responseText.success) {
                            var result = responseText.data;
                            var map = {
                                50260201: `订单金额超过信贷额`,
                                50260202: `存在逾期账单`,
                            };
                            if (result.result == false) {
                                Ext.Msg.alert('提示', map[result.lockedCode]);
                            } else {
                                Ext.Msg.alert('提示', '解锁成功', function () {
                                    location.reload();
                                });
                            }

                        }
                    }
                }, true);
            }
        });
    }

})
