Ext.define('CGP.material.model.BomItem', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'quantityStrategy',
            type: 'string'
        },
        {
            name: 'itemMaterial',
            type: 'object'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        }, {
            name: 'type',
            type: 'string',
            convert: function (value, record) {
                var clazz = record.get('clazz');
                if (clazz == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                    return 'UnassignBOMItem'
                } else if (clazz == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem') {
                    return 'FixedBOMItem'
                } else if (clazz == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {
                    return 'OptionalBOMItem'
                }
            }
        },
        {
            name: 'constraints',
            type: 'array'
        }, {
            name: 'optionalMaterials',
            type: 'array',
            defaultValue: undefined
        }, {
            name: 'range',
            type: 'object',
            defaultValue: undefined/*,
            serialize: function(value,record){
                var min = record.get('min');
                var max = record.get('max');
                if(!Ext.isEmpty(min)){
                    return {
                        clazz: 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItemItemRange',
                        min: min,
                        max: max
                    }
                }else{
                    return undefined;
                }
            }*/
        }, {
            name: 'quantity',
            type: 'int',
            useNull: 'int'
        }, {
            name: 'quantityDesc',
            type: 'object',
            defaultValue: undefined
        },
        {
            name: 'isCompleted',
            type: 'boolean',
            defaultValue: false,
            convert: function (value, record) {
                //smu 且 quantity有值 且 关联物料为spu
                if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem' &&
                    !Ext.isEmpty(record.get('quantity')) &&
                    record.get('itemMaterial').clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: 'sourceBomItemId',
            type: 'string'
        }
    ]
});