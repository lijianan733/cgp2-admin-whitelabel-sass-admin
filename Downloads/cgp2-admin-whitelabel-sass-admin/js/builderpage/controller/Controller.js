/**
 * @author xiu
 * @date 2023/9/21
 */
Ext.define('CGP.builderpage.controller.Controller', {
    editQuery: function (url, jsonData, isEdit) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, successMsg, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                }
            }
        }, true);
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, msg) {
        var method = isEdit ? 'PUT' : 'POST';

        JSAjaxRequest(url, method, true, jsonData, msg, callFn, true);
    },

    //查询
    getQuery: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        })
        return data;
    },

    //删除
    deleteQuery: function (url) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    console.log(responseText.data.content || responseText.data);
                }
            }
        }, true)
    },

    //获取url
    getUrl: function (author) {
        var urlGather = {
            mainUrl: adminPath + 'api/colors',

        }
        return urlGather[author];
    },

    // 左单选栏信息收集
    leftSingleSelectFun: function (operationValue) {
        return {
            elements: [
                {
                    clazz: 'ElementSelector',
                    layerTags: ['Mask', 'Mask50', 'Mask100'],
                    elementClazz: ['Image'],
                    elementTags: []
                }
            ],
            operationType: 'SET',
            attribute: 'alpha',
            single: 'alpha',
            value: operationValue,
        }
    },

    // 右工具栏信息收集
    rightToolsFun: function (isVisible, viewIds) {
        var elements = []
        viewIds.forEach(item => {
            elements.push(
                {
                    clazz: 'ElementSelector',
                    viewId: item._id,
                    pcId: 'ALL.PC',
                    name: item.name || ''
                }
            )
        })

        return {
            elements: elements,
            operationType: 'SET',
            attribute: 'isClip',
            single: 'isClip',
            value: isVisible,
        }
    },

    // 中间控制颜色
    centerColorFun: function (layerTags, color) {
        return {
            elements: [
                {
                    clazz: 'ElementSelector',
                    layerTags: layerTags,
                    elementClazz: 'ShapeObject',
                    attribute: 'strokeStyle',
                    elementTags: [],
                }
            ],
            operationType: 'SET',
            attribute: 'color',
            single: JSON.stringify(layerTags) + 'Color',
            value: +color,
        }
    },

    // 中间控制线
    centerLineFun: function (layerTags, isVisible) {
        return {
            elements: [
                {
                    attribute: 'strokeStyle',
                    clazz: 'ElementSelector',
                    elementClazz: 'ShapeObject',
                    layerTags: layerTags,
                }
            ],
            operationType: 'SET',
            attribute: 'alpha',
            single: layerTags,
            value: isVisible ? 1 : 0,
        }
    },

    // 物料选择数据
    changeAndBootstrap: function (type, materialViews) {
        return {
            eventId: JSGetUUID(),
            type: 'qp.builder.production.' + type,
            document: {
                _id: 'changeAndBootstrap',
                clazz: 'MaterialViewArray',
                materialViews: materialViews
            }
        }
    },

    // 单行预览数与图片大小
    previewImageQtyAndImageSizeFun: function (columnQty, fitMode) {
        return {
            eventId: JSGetUUID(),
            type: 'qp.builder.production.updateView',
            single: 'qtyAndSize',
            columnQty: columnQty,
            fitMode: fitMode //auto
        }
    },

    // 预览图片
    previewImageFun: function (previewMode) {
        return {
            eventId: JSGetUUID(),
            type: 'qp.builder.production.changeSortModel',
            sortModel: previewMode
        }
    },

    // 集合初始化数据
    mainQueryFun: function (compItem, type, sign) {
        const controller = this;

        var result = [],
            mergeData = {};

        // 完整数据
        compItem.forEach(item => {
            if (item.name) {
                const value = item.diyGetValue();
                // 当循环到中间颜色栏时 和 左边的选中栏
                if (['centerColor', 'leftSingleSelect'].includes(item.itemId)) {
                    result = Ext.Array.merge(result, value)
                } else {
                    result.push(item.diyGetValue())
                }
            }
        })

        //单请求时
        if (!Ext.isEmpty(sign)) {
            var newResult = [],
                {nameArray} = sign;

            result.forEach(item => {
                const {single} = item;
                nameArray.forEach(arrayItem => {
                    if (JSON.stringify(single) === JSON.stringify(arrayItem)) {
                        newResult.push(item);
                    }
                })
            })

            result = newResult;
        }

        return {
            eventId: JSGetUUID(),
            type: 'qp.builder.production.' + type,
            operations: result
        }
    },

    // 向iframe中传递数据
    callChild: function (data, callFn) {
        var controller = this,
            isCount = false,
            builderView = document.getElementById('builderView'),
            authIframe = builderView.getElementsByTagName('iframe')[0];

        console.log(data);
        authIframe.contentWindow.postMessage(JSON.stringify(data), '*');

        controller.getIframeInfoFn('事件请求超时,请重试!', function (e, loadTime) {
            let data = e.data;
            typeof data === 'string' && (data = JSON.parse(data));

            if (!isCount && data?.type === 'qp.builder.production.afterViewChanged' && data?.args) {
                callFn();
                isCount = true;
            }

            clearTimeout(loadTime);
            if (data?.args === false && data?.type) {
                const error = {
                    'qp.builder.production.onInit': function () {
                        Ext.Msg.alert('提示', '程序初始化失败', function () {
                            callFn();
                        });
                    },
                    'qp.builder.production.afterChecked': function () {
                        Ext.Msg.alert('提示', '检查数据格式失败', function () {
                            callFn();
                        });
                    },
                    'qp.builder.production.onViewChange': function () {
                        Ext.Msg.alert('提示', '页面初始化失败', function () {
                            callFn();
                        });
                    },
                    'qp.builder.production.afterViewChanged': function () {
                        Ext.Msg.alert('提示', '页面初始化未完成', function () {
                            callFn();
                        });
                    },
                }
                error[data.type]();
            }
        }, 20000)
    },

    // 接收iframe信息
    getIframeInfoFn: function (text, callBack, overTime) {
        // 设置加载超时处理
        var loadTime = setTimeout(() => {
            JSSetLoading(false);
            Ext.Msg.alert('提示', text, function () {
                location.reload();
            });
        }, overTime)

        window.addEventListener('message', function (e) {
            try {
                // 清理超时定时器
                callBack && callBack(e, loadTime);
            } catch (error) {
                console.log(error);
            }
        });
    },

    // 设置工具栏遮罩层
    setToolsMark: function (loadMask, isShow) {
        isShow ? loadMask.show() : loadMask.hide();
    },

    // 监听窗口大小
    onWindowResize: function (callFn) {
        Ext.EventManager.onWindowResize(function (width, height) {
            callFn(width, height);
        });
    },

    //验证双数正整数
    isEvenPositiveInteger: function (value) {
        return typeof value === 'number' &&
            Number.isInteger(value) &&
            value > 0 &&
            value % 2 === 0;
    },

    addLineBreaks: function (data) {
        function addLineBreaksAndConvertToString(obj) {
            const keys = Object.keys(obj);
            const result = keys.map(key => `${key}: ${JSON.stringify(obj[key])}`).join('<br>');
            return result;
        }

        return data.map((item, index) => {
            const prefox = index + 1 + '. '
            return `${prefox}{<br>${JSON.stringify(addLineBreaksAndConvertToString(item))}<br>}<br>`;
        }).join('<br>');
    },
});