import { message } from 'antd';
import Rect from './rect';
import BoxModel from './boxModel';

function ElementNode(_uid) {

  this.rect = new Rect;
  this.boxModel = new BoxModel(this.rect);
  this.node = null;

  this._uid = _uid;
  this.display = 'initial';

  this.update = function (document) {
    if (!this.node)
      return;

    const offsetX = 0;//document.documentElement.scrollLeft;
    const offsetY = 0;//document.documentElement.scrollTop;

    const rect = this.node.getBoundingClientRect();
    this.rect.x = rect.left + offsetX;
    this.rect.y = rect.top + offsetY;
    this.rect.width = rect.width;
    this.rect.height = rect.height;
    this.rect.right = rect.right;
    this.rect.bottom = rect.bottom;



    this.rect.update();

    const computedStyle = window.getComputedStyle(this.node);


    this.display = computedStyle.display;
    this.boxModel.update(computedStyle, 0.5);

  }


}

export const getStateValue = (key, states) => {

  let defaultValue = "";

  if (!states)
    return defaultValue;

  const stateRef = states[key[0]];

  if (!stateRef)
    return defaultValue;


  if (stateRef.type == 'image') {
    defaultValue = {
      value: stateRef.src ? stateRef.src.src : '/images/default/default-img.png',
      label: stateRef.src?.alt
    }
  }
  else
    if (stateRef.type == 'video') {
      defaultValue = {
        value: stateRef.src ? stateRef.src.src : '/images/default/default-poster.png',
        label: stateRef.src?.alt, srcs: stateRef.srcs
      }
    } else
      if (stateRef.type == 'audio') {
        defaultValue = {
          value: '/audios/default/sample.mp3', srcs: stateRef.srcs
        }
      }
      else
        if (key[1] && stateRef.states) {
          defaultValue = (stateRef.states[key[1]] !== undefined ? stateRef.states[key[1]] : "")
        }
        else
          defaultValue = (stateRef.defaultValue !== undefined ? stateRef.defaultValue : "");



  return defaultValue;
}

export const getStateStates = (key, states) => {


  let values = [];

  if (!states)
    return values;

  const value = states[key[0]];
  if (!value)
    return values;

  // if (value.type == 'arraylength') {
  //   const defaultValue = (value.defaultValue !== undefined ? value.defaultValue : 0);
  //   values = Array.from({ length: parseInt(defaultValue) }, (_, index) => {
  //     return { label: `${value.text || "Item"} ${index}`, value: index }
  //   })
  // }


  if (value.type == 'array') {
    values = Object.values(value.states).map((value, index) => {
      const val = value.split(":");
      return { label: val[0], value: val[1] ? val[1] : index }
    })
  }

  if (value.type == 'images') {
    values = Object.values(value.states).map((value) => {
      return { label: value.alt, value: value.src }
    })
  }


  return values;
}

export const getStateRef = (key, states) => {

  if (!states)
    return undefined;

  let value = states[key[0]];
  return value;
}



export const updateStateValue = (key, withValue, states, value, updateKey = "defaultValue") => {



  let stateRef = getStateRef(key, states);

  if (!stateRef)
    return false;

  try {
    let val = '';
    let evalString;


    if (withValue)
      evalString = `${withValue} ${value}`;
    else
      evalString = `${value}`;

    evalString = evalString.replace(/\s/g, '');
    const hasNonNumeric = /[^+\-*/()\d]/.test(evalString);
    val = hasNonNumeric ? evalString : eval(evalString);
    if (val >= stateRef.max && updateKey !== 'max')
      val = stateRef.max - 1;
    else
      if (val <= stateRef.min && updateKey !== 'min')
        val = stateRef.min;



    if (stateRef.type == 'boolean')
      val = stateRef[updateKey] ? 0 : 1;

    if (stateRef.type == 'array')
      val = val.split(',')

    if (key[1])
      stateRef.states[key[1]] = val;
    else
      stateRef[updateKey] = val;


  } catch (e) {

    message.error(e.message);
  }



}


export const generateCascader = (elementStates, type) => {



  const states = Object.values(elementStates).map(state => {
    let children = null;
    if (state.states) {
      state.type = state.type || 'array';
      children = Object.keys(state.states).map((key, index) => {
        return {
          label: key.toUpperCase(), value: key
        }
      });
    } else
      children = undefined;

    return {
      label: state.key.toUpperCase(), value: state.key, type: state.type, children
    }
  });

  return [{ label: type, value: type, type: type, children: states }]
}

export const generateCascaderCollStates = (elementStates, type) => {

  const states = Object.entries(elementStates).map(([key, value]) => {
    let children = null;
    const state = { key: key.toUpperCase(), value: key }
    if (key == 'documents') {
      state.type = 'array';
    }
    if (key == 'states') {
      return generateCascader(value, 'STATES')[0];
    }

    return {
      label: state.key.toUpperCase(), value: state.value, type: state.type, children
    }
  });

  return [{ label: type, value: type, type: type, children: states }]
}


export const getPaginationRange = (currentPage, totalPages, pagination) => {
  let leftRangeLength = pagination.leftRange || 1;
  let rightRangeLength = pagination.rightRange || 1;
  const rangeSize = pagination.nearRange || 2;

  const dots = pagination.dots || "...";

  let start = Math.max(currentPage - rangeSize, 1);
  let end = Math.min(currentPage + rangeSize, totalPages);

  if (leftRangeLength > totalPages) {
    leftRangeLength = totalPages;
    rightRangeLength = 0;
  }

  if (rightRangeLength + leftRangeLength > totalPages) {
    rightRangeLength = totalPages - leftRangeLength;
  }


  if (start === 1) {
    end = Math.min(start + rangeSize * 2, totalPages);
  } else if (end === totalPages) {
    start = Math.max(end - rangeSize * 2, 1);
  }

  const leftRange = [];
  const rightRange = [];

  for (let i = 1; i <= leftRangeLength; i++) {
    leftRange.push(i);
  }

  if (start > leftRangeLength + 1) {
    leftRange.push(dots);
  }

  if (end < totalPages - rightRangeLength) {
    rightRange.push(dots);
  }

  for (let i = totalPages - rightRangeLength + 1; i <= totalPages; i++) {
    rightRange.push(i);
  }

  const nearbyRange = [];

  const startIndex = start > leftRangeLength ? start : leftRangeLength + 1;

  const endIndex = end < totalPages - rightRangeLength + 1 ? end : end - rightRangeLength;
  for (let i = startIndex; i <= endIndex; i++) {
    nearbyRange.push(i);
  }

  return [...leftRange, ...nearbyRange, ...rightRange];
};

export default ElementNode;