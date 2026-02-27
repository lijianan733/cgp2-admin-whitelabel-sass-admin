/**
 * @Description:
 * @author nan
 * @date 2022/9/7
 */
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.model.ShipmentItemTypeSettingModel'
])
Ext.define('CGP.orderstatusmodify.store.ShipmentItemTypeSettingStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.orderstatusmodify.model.ShipmentItemTypeSettingModel'],
    model: 'CGP.orderstatusmodify.model.ShipmentItemTypeSettingModel',
    proxy: {
        type: 'uxrest',
        url: mccsPath + 'api/costAccounting/statistics/products/{configurationProductId}/cost',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    pageSize: 25,
    params: null,
    autoLoad: true,
    sorters: [{
        property: 'seqNo',
        direction: 'ASC'
    }],
   /* proxy: {
        type: 'memory',
    },
    data: [
        {
            seqNo: 3,
            orderNumber: 'orderNumber',
            productInfo: {
                productId: 124,
                productName: 'productName',
                productInstanceId: 'productInstanceId',
                productSku: 'productSku',
                thumbnail: '9f4ce6ea-0a40-4b1f-93bd-aa203bdeadde-0.jpg',
            },
            paibanStatus: 4,
            productionStatus: 4,
            waitPaibanTime: 1763695467401,
            waitPaibanEndTime: 1763695483309,
            paibanStartTime: 1763695467401,
            paibanEndTime: 1763695483309,
            composingTaskExecutionTimeStatistics: {
                "taskId": '311696925',
                "name": "�������Ű�����",
                "type": "ORDERITEM_COMPOSING",
                "subTasks": [
                    {
                        "name": "�������Ű������ĳ�ʼ������",
                        "type": "INIT_ORDERITEM_CONTEXT",
                        "subTasks": [],
                        "startTime": 1763774557657,
                        "endTime": 1763774558101,
                        "waitingTimeMs": 0,
                        "runningTimeMs": 444
                    },
                    {
                        "name": "QPSON 2.48x3.46���� PS��Ƭ����18-612��PCS�֌�(53761940)",
                        "type": "COMPOSING_JOB",
                        "subTasks": [
                            {
                                "name": "QPSON 2.48x3.46�������棨���ӽ���ģ�壩(53761937)",
                                "type": "GENERATE_PAGE",
                                "subTasks": [],
                                "startTime": 1763774562936,
                                "endTime": 1763774568713,
                                "waitingTimeMs": 1314,
                                "runningTimeMs": 31147
                            },
                            {
                                "name": "QPSON 2.48x3.46���Ʊ���(53761938)",
                                "type": "GENERATE_PAGE",
                                "subTasks": [],
                                "startTime": 1763774568763,
                                "endTime": 1763774572258,
                                "waitingTimeMs": 8454,
                                "runningTimeMs": 34642
                            },
                            {
                                "name": "���ƣ�Ƭ����18-612��(53761941)",
                                "type": "IMPRESSION",
                                "subTasks": [],
                                "startTime": 1763774575262,
                                "endTime": 1763774579972,
                                "waitingTimeMs": 9073,
                                "runningTimeMs": 39352
                            },
                            {
                                "name": "job_�����ַ�����",
                                "type": "DISTRIBUTE",
                                "subTasks": [
                                    {
                                        "name": "job_�����ַ�����_���ɵ���",
                                        "type": "GENERATE_DISTRIBUTE_FILE",
                                        "subTasks": [],
                                        "startTime": 1763774580611,
                                        "endTime": 1763774585389,
                                        "waitingTimeMs": 9295,
                                        "runningTimeMs": 50209
                                    },
                                    {
                                        "name": "job_�����ַ�����_���ɵ���",
                                        "type": "GENERATE_DISTRIBUTE_FILE",
                                        "subTasks": [],
                                        "startTime": 1763774580611,
                                        "endTime": 1763774585389,
                                        "waitingTimeMs": 9436,
                                        "runningTimeMs": 54987
                                    },
                                    {
                                        "name": "job_�����ַ�����_���䵵��",
                                        "type": "JOB_TASK_TRANSFER",
                                        "subTasks": [],
                                        "startTime": 1763774585521,
                                        "endTime": 1763774586549,
                                        "waitingTimeMs": 9436,
                                        "runningTimeMs": 56015
                                    },
                                    {
                                        "name": "job_�����ַ�����_���䵵��",
                                        "type": "JOB_TASK_TRANSFER",
                                        "subTasks": [],
                                        "startTime": 1763774585521,
                                        "endTime": 1763774586549,
                                        "waitingTimeMs": 9436,
                                        "runningTimeMs": 57043
                                    }
                                ],
                                "startTime": 1763774580470,
                                "endTime": 1763774586549,
                                "waitingTimeMs": 9436,
                                "runningTimeMs": 57043
                            }
                        ],
                        "startTime": 1763774561623,
                        "endTime": 1763774586549,
                        "waitingTimeMs": 9154,
                        "runningTimeMs": 45431
                    },
                    {
                        "name": "QPSON 2.48x3.46���� PS��Ƭ����18-612��PCS�֌�(53761940)",
                        "type": "COMPOSING_JOB",
                        "subTasks": [
                            {
                                "name": "QPSON 2.48x3.46�������棨���ӽ���ģ�壩(53761937)",
                                "type": "GENERATE_PAGE",
                                "subTasks": [],
                                "startTime": 1763774562936,
                                "endTime": 1763774568713,
                                "waitingTimeMs": 1315,
                                "runningTimeMs": 56073
                            },
                            {
                                "name": "QPSON 2.48x3.46���Ʊ���(53761938)",
                                "type": "GENERATE_PAGE",
                                "subTasks": [],
                                "startTime": 1763774568763,
                                "endTime": 1763774572258,
                                "waitingTimeMs": 8455,
                                "runningTimeMs": 59568
                            },
                            {
                                "name": "���ƣ�Ƭ����18-612��(53761941)",
                                "type": "IMPRESSION",
                                "subTasks": [],
                                "startTime": 1763774575262,
                                "endTime": 1763774579972,
                                "waitingTimeMs": 9074,
                                "runningTimeMs": 64278
                            },
                            {
                                "name": "job_�����ַ�����",
                                "type": "DISTRIBUTE",
                                "subTasks": [
                                    {
                                        "name": "job_�����ַ�����_���ɵ���",
                                        "type": "GENERATE_DISTRIBUTE_FILE",
                                        "subTasks": [],
                                        "startTime": 1763774580611,
                                        "endTime": 1763774585389,
                                        "waitingTimeMs": 9296,
                                        "runningTimeMs": 75135
                                    },
                                    {
                                        "name": "job_�����ַ�����_���ɵ���",
                                        "type": "GENERATE_DISTRIBUTE_FILE",
                                        "subTasks": [],
                                        "startTime": 1763774580611,
                                        "endTime": 1763774585389,
                                        "waitingTimeMs": 9437,
                                        "runningTimeMs": 79913
                                    },
                                    {
                                        "name": "job_�����ַ�����_���䵵��",
                                        "type": "JOB_TASK_TRANSFER",
                                        "subTasks": [],
                                        "startTime": 1763774585521,
                                        "endTime": 1763774586549,
                                        "waitingTimeMs": 9437,
                                        "runningTimeMs": 80941
                                    },
                                    {
                                        "name": "job_�����ַ�����_���䵵��",
                                        "type": "JOB_TASK_TRANSFER",
                                        "subTasks": [],
                                        "startTime": 1763774585521,
                                        "endTime": 1763774586549,
                                        "waitingTimeMs": 9437,
                                        "runningTimeMs": 81969
                                    }
                                ],
                                "startTime": 1763774580470,
                                "endTime": 1763774586549,
                                "waitingTimeMs": 9437,
                                "runningTimeMs": 81969
                            }
                        ],
                        "startTime": 1763774561623,
                        "endTime": 1763774586549,
                        "waitingTimeMs": 9155,
                        "runningTimeMs": 70357
                    },
                    {
                        "name": "������������������������",
                        "type": "GENERATE_SMU_CONTENT",
                        "subTasks": [],
                        "startTime": 1763774589956,
                        "endTime": 1763774596553,
                        "waitingTimeMs": 2,
                        "runningTimeMs": 56893
                    }
                ],
                "startTime": 1763774557679,
                "endTime": 1763774596778,
                "waitingTimeMs": 2,
                "runningTimeMs": 56893
            },
            productionPostTime: 1763719092411,
            productionFinishTime: 1764719092411,
        },
        {
            seqNo: 1,
            orderNumber: 'orderNumber',
            productInfo: {
                productId: 124,
                productName: 'productName',
                productInstanceId: 'productInstanceId',
                productSku: 'productSku',
                thumbnail: '9f4ce6ea-0a40-4b1f-93bd-aa203bdeadde-0.jpg',
            },
            paibanStatus: 4,
            productionStatus: 4,
            waitPaibanTime: 1763695467401,
            waitPaibanEndTime: 1763695483309,
            paibanStartTime: 1763695467401,
            paibanEndTime: 1763695483309,
            composingTaskExecutionTimeStatistics: {
                "taskId": '311696925',
                "name": "�������Ű�����",
                "type": "ORDERITEM_COMPOSING",
                "subTasks": [
                    {
                        "name": "�������Ű������ĳ�ʼ������",
                        "type": "INIT_ORDERITEM_CONTEXT",
                        "subTasks": [],
                        "startTime": 1763774557657,
                        "endTime": 1763774558101,
                        "waitingTimeMs": 0,
                        "runningTimeMs": 444
                    },
                    {
                        "name": "QPSON 2.48x3.46���� PS��Ƭ����18-612��PCS�֌�(53761940)",
                        "type": "COMPOSING_JOB",
                        "subTasks": [
                            {
                                "name": "QPSON 2.48x3.46�������棨���ӽ���ģ�壩(53761937)",
                                "type": "GENERATE_PAGE",
                                "subTasks": [],
                                "startTime": 1763774562936,
                                "endTime": 1763774568713,
                                "waitingTimeMs": 1314,
                                "runningTimeMs": 31147
                            },
                            {
                                "name": "QPSON 2.48x3.46���Ʊ���(53761938)",
                                "type": "GENERATE_PAGE",
                                "subTasks": [],
                                "startTime": 1763774568763,
                                "endTime": 1763774572258,
                                "waitingTimeMs": 8454,
                                "runningTimeMs": 34642
                            },
                            {
                                "name": "���ƣ�Ƭ����18-612��(53761941)",
                                "type": "IMPRESSION",
                                "subTasks": [],
                                "startTime": 1763774575262,
                                "endTime": 1763774579972,
                                "waitingTimeMs": 9073,
                                "runningTimeMs": 39352
                            },
                            {
                                "name": "job_�����ַ�����",
                                "type": "DISTRIBUTE",
                                "subTasks": [
                                    {
                                        "name": "job_�����ַ�����_���ɵ���",
                                        "type": "GENERATE_DISTRIBUTE_FILE",
                                        "subTasks": [],
                                        "startTime": 1763774580611,
                                        "endTime": 1763774585389,
                                        "waitingTimeMs": 9295,
                                        "runningTimeMs": 50209
                                    },
                                    {
                                        "name": "job_�����ַ�����_���ɵ���",
                                        "type": "GENERATE_DISTRIBUTE_FILE",
                                        "subTasks": [],
                                        "startTime": 1763774580611,
                                        "endTime": 1763774585389,
                                        "waitingTimeMs": 9436,
                                        "runningTimeMs": 54987
                                    },
                                    {
                                        "name": "job_�����ַ�����_���䵵��",
                                        "type": "JOB_TASK_TRANSFER",
                                        "subTasks": [],
                                        "startTime": 1763774585521,
                                        "endTime": 1763774586549,
                                        "waitingTimeMs": 9436,
                                        "runningTimeMs": 56015
                                    },
                                    {
                                        "name": "job_�����ַ�����_���䵵��",
                                        "type": "JOB_TASK_TRANSFER",
                                        "subTasks": [],
                                        "startTime": 1763774585521,
                                        "endTime": 1763774586549,
                                        "waitingTimeMs": 9436,
                                        "runningTimeMs": 57043
                                    }
                                ],
                                "startTime": 1763774580470,
                                "endTime": 1763774586549,
                                "waitingTimeMs": 9436,
                                "runningTimeMs": 57043
                            }
                        ],
                        "startTime": 1763774561623,
                        "endTime": 1763774586549,
                        "waitingTimeMs": 9154,
                        "runningTimeMs": 45431
                    },
                    {
                        "name": "QPSON 2.48x3.46���� PS��Ƭ����18-612��PCS�֌�(53761940)",
                        "type": "COMPOSING_JOB",
                        "subTasks": [
                            {
                                "name": "QPSON 2.48x3.46�������棨���ӽ���ģ�壩(53761937)",
                                "type": "GENERATE_PAGE",
                                "subTasks": [],
                                "startTime": 1763774562936,
                                "endTime": 1763774568713,
                                "waitingTimeMs": 1315,
                                "runningTimeMs": 56073
                            },
                            {
                                "name": "QPSON 2.48x3.46���Ʊ���(53761938)",
                                "type": "GENERATE_PAGE",
                                "subTasks": [],
                                "startTime": 1763774568763,
                                "endTime": 1763774572258,
                                "waitingTimeMs": 8455,
                                "runningTimeMs": 59568
                            },
                            {
                                "name": "���ƣ�Ƭ����18-612��(53761941)",
                                "type": "IMPRESSION",
                                "subTasks": [],
                                "startTime": 1763774575262,
                                "endTime": 1763774579972,
                                "waitingTimeMs": 9074,
                                "runningTimeMs": 64278
                            },
                            {
                                "name": "job_�����ַ�����",
                                "type": "DISTRIBUTE",
                                "subTasks": [
                                    {
                                        "name": "job_�����ַ�����_���ɵ���",
                                        "type": "GENERATE_DISTRIBUTE_FILE",
                                        "subTasks": [],
                                        "startTime": 1763774580611,
                                        "endTime": 1763774585389,
                                        "waitingTimeMs": 9296,
                                        "runningTimeMs": 75135
                                    },
                                    {
                                        "name": "job_�����ַ�����_���ɵ���",
                                        "type": "GENERATE_DISTRIBUTE_FILE",
                                        "subTasks": [],
                                        "startTime": 1763774580611,
                                        "endTime": 1763774585389,
                                        "waitingTimeMs": 9437,
                                        "runningTimeMs": 79913
                                    },
                                    {
                                        "name": "job_�����ַ�����_���䵵��",
                                        "type": "JOB_TASK_TRANSFER",
                                        "subTasks": [],
                                        "startTime": 1763774585521,
                                        "endTime": 1763774586549,
                                        "waitingTimeMs": 9437,
                                        "runningTimeMs": 80941
                                    },
                                    {
                                        "name": "job_�����ַ�����_���䵵��",
                                        "type": "JOB_TASK_TRANSFER",
                                        "subTasks": [],
                                        "startTime": 1763774585521,
                                        "endTime": 1763774586549,
                                        "waitingTimeMs": 9437,
                                        "runningTimeMs": 81969
                                    }
                                ],
                                "startTime": 1763774580470,
                                "endTime": 1763774586549,
                                "waitingTimeMs": 9437,
                                "runningTimeMs": 81969
                            }
                        ],
                        "startTime": 1763774561623,
                        "endTime": 1763774586549,
                        "waitingTimeMs": 9155,
                        "runningTimeMs": 70357
                    },
                    {
                        "name": "������������������������",
                        "type": "GENERATE_SMU_CONTENT",
                        "subTasks": [],
                        "startTime": 1763774589956,
                        "endTime": 1763774596553,
                        "waitingTimeMs": 2,
                        "runningTimeMs": 56893
                    }
                ],
                "startTime": 1763774557679,
                "endTime": 1763774596778,
                "waitingTimeMs": 2,
                "runningTimeMs": 56893
            },
            productionPostTime: 1763719092411,
        },
        {
            seqNo: 2,
            orderNumber: 'orderNumber',
            productInfo: {
                productId: 124,
                productName: 'productName',
                productInstanceId: 'productInstanceId',
                productSku: 'productSku',
                thumbnail: '9f4ce6ea-0a40-4b1f-93bd-aa203bdeadde-0.jpg',
            },
            paibanStatus: 4,
            productionStatus: 4,
            waitPaibanTime: 1763695467401,
            waitPaibanEndTime: 1763695483309,
            paibanStartTime: 1763695467401,
            paibanEndTime: 1763695483309,
            composingTaskExecutionTimeStatistics: {
                "taskId": '311696925',
                "name": "�������Ű�����",
                "type": "ORDERITEM_COMPOSING",
                "subTasks": [
                    {
                        "name": "�������Ű������ĳ�ʼ������",
                        "type": "INIT_ORDERITEM_CONTEXT",
                        "subTasks": [],
                        "startTime": 1763774557657,
                        "endTime": 1763774558101,
                        "waitingTimeMs": 0,
                        "runningTimeMs": 444
                    },
                    {
                        "name": "QPSON 2.48x3.46���� PS��Ƭ����18-612��PCS�֌�(53761940)",
                        "type": "COMPOSING_JOB",
                        "subTasks": [
                            {
                                "name": "QPSON 2.48x3.46�������棨���ӽ���ģ�壩(53761937)",
                                "type": "GENERATE_PAGE",
                                "subTasks": [],
                                "startTime": 1763774562936,
                                "endTime": 1763774568713,
                                "waitingTimeMs": 1314,
                                "runningTimeMs": 31147
                            },
                            {
                                "name": "QPSON 2.48x3.46���Ʊ���(53761938)",
                                "type": "GENERATE_PAGE",
                                "subTasks": [],
                                "startTime": 1763774568763,
                                "endTime": 1763774572258,
                                "waitingTimeMs": 8454,
                                "runningTimeMs": 34642
                            },
                            {
                                "name": "���ƣ�Ƭ����18-612��(53761941)",
                                "type": "IMPRESSION",
                                "subTasks": [],
                                "startTime": 1763774575262,
                                "endTime": 1763774579972,
                                "waitingTimeMs": 9073,
                                "runningTimeMs": 39352
                            },
                            {
                                "name": "job_�����ַ�����",
                                "type": "DISTRIBUTE",
                                "subTasks": [
                                    {
                                        "name": "job_�����ַ�����_���ɵ���",
                                        "type": "GENERATE_DISTRIBUTE_FILE",
                                        "subTasks": [],
                                        "startTime": 1763774580611,
                                        "endTime": 1763774585389,
                                        "waitingTimeMs": 9295,
                                        "runningTimeMs": 50209
                                    },
                                    {
                                        "name": "job_�����ַ�����_���ɵ���",
                                        "type": "GENERATE_DISTRIBUTE_FILE",
                                        "subTasks": [],
                                        "startTime": 1763774580611,
                                        "endTime": 1763774585389,
                                        "waitingTimeMs": 9436,
                                        "runningTimeMs": 54987
                                    },
                                    {
                                        "name": "job_�����ַ�����_���䵵��",
                                        "type": "JOB_TASK_TRANSFER",
                                        "subTasks": [],
                                        "startTime": 1763774585521,
                                        "endTime": 1763774586549,
                                        "waitingTimeMs": 9436,
                                        "runningTimeMs": 56015
                                    },
                                    {
                                        "name": "job_�����ַ�����_���䵵��",
                                        "type": "JOB_TASK_TRANSFER",
                                        "subTasks": [],
                                        "startTime": 1763774585521,
                                        "endTime": 1763774586549,
                                        "waitingTimeMs": 9436,
                                        "runningTimeMs": 57043
                                    }
                                ],
                                "startTime": 1763774580470,
                                "endTime": 1763774586549,
                                "waitingTimeMs": 9436,
                                "runningTimeMs": 57043
                            }
                        ],
                        "startTime": 1763774561623,
                        "endTime": 1763774586549,
                        "waitingTimeMs": 9154,
                        "runningTimeMs": 45431
                    },
                    {
                        "name": "QPSON 2.48x3.46���� PS��Ƭ����18-612��PCS�֌�(53761940)",
                        "type": "COMPOSING_JOB",
                        "subTasks": [
                            {
                                "name": "QPSON 2.48x3.46�������棨���ӽ���ģ�壩(53761937)",
                                "type": "GENERATE_PAGE",
                                "subTasks": [],
                                "startTime": 1763774562936,
                                "endTime": 1763774568713,
                                "waitingTimeMs": 1315,
                                "runningTimeMs": 56073
                            },
                            {
                                "name": "QPSON 2.48x3.46���Ʊ���(53761938)",
                                "type": "GENERATE_PAGE",
                                "subTasks": [],
                                "startTime": 1763774568763,
                                "endTime": 1763774572258,
                                "waitingTimeMs": 8455,
                                "runningTimeMs": 59568
                            },
                            {
                                "name": "���ƣ�Ƭ����18-612��(53761941)",
                                "type": "IMPRESSION",
                                "subTasks": [],
                                "startTime": 1763774575262,
                                "endTime": 1763774579972,
                                "waitingTimeMs": 9074,
                                "runningTimeMs": 64278
                            },
                            {
                                "name": "job_�����ַ�����",
                                "type": "DISTRIBUTE",
                                "subTasks": [
                                    {
                                        "name": "job_�����ַ�����_���ɵ���",
                                        "type": "GENERATE_DISTRIBUTE_FILE",
                                        "subTasks": [],
                                        "startTime": 1763774580611,
                                        "endTime": 1763774585389,
                                        "waitingTimeMs": 9296,
                                        "runningTimeMs": 75135
                                    },
                                    {
                                        "name": "job_�����ַ�����_���ɵ���",
                                        "type": "GENERATE_DISTRIBUTE_FILE",
                                        "subTasks": [],
                                        "startTime": 1763774580611,
                                        "endTime": 1763774585389,
                                        "waitingTimeMs": 9437,
                                        "runningTimeMs": 79913
                                    },
                                    {
                                        "name": "job_�����ַ�����_���䵵��",
                                        "type": "JOB_TASK_TRANSFER",
                                        "subTasks": [],
                                        "startTime": 1763774585521,
                                        "endTime": 1763774586549,
                                        "waitingTimeMs": 9437,
                                        "runningTimeMs": 80941
                                    },
                                    {
                                        "name": "job_�����ַ�����_���䵵��",
                                        "type": "JOB_TASK_TRANSFER",
                                        "subTasks": [],
                                        "startTime": 1763774585521,
                                        "endTime": 1763774586549,
                                        "waitingTimeMs": 9437,
                                        "runningTimeMs": 81969
                                    }
                                ],
                                "startTime": 1763774580470,
                                "endTime": 1763774586549,
                                "waitingTimeMs": 9437,
                                "runningTimeMs": 81969
                            }
                        ],
                        "startTime": 1763774561623,
                        "endTime": 1763774586549,
                        "waitingTimeMs": 9155,
                        "runningTimeMs": 70357
                    },
                    {
                        "name": "������������������������",
                        "type": "GENERATE_SMU_CONTENT",
                        "subTasks": [],
                        "startTime": 1763774589956,
                        "endTime": 1763774596553,
                        "waitingTimeMs": 2,
                        "runningTimeMs": 56893
                    }
                ],
                "startTime": 1763774557679,
                "endTime": 1763774596778,
                "waitingTimeMs": 2,
                "runningTimeMs": 56893
            },
            productionPostTime: 1763719092411,
            productionFinishTime: 1764719092411,
        }
    ],*/
    pageType: 'shipmentRequirementId',
    constructor: function (config) {
        var me = this;
        if (config && config.pageType) {
            var {pageType, configId} = config,
                typeGather = {
                    shipmentRequirementId: `api/shipmentRequirements/${configId}/process`,
                    orderId: `api/orders/${configId}/process`,
                }

            me.proxy.url = adminPath + typeGather[pageType];
        }
        me.callParent(arguments);
    }
})
