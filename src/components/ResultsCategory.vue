<template>
  <div
    class="${suggestionPrefix} ${suggestion.isCategoryHeader ? `${suggestionPrefix}__main` : ''} ${suggestion.isSubCategoryHeader ? `${suggestionPrefix}__secondary` : ''} suggestion-layout-simple"
  >
    <div class="${suggestionPrefix}--category-header">
      ${ !suggestion.isLvl0 ? `
      <span
        class="${suggestionPrefix}--category-header-lvl0 ${suggestionPrefix}--category-header-item"
      >
        ${suggestion.category}
      </span>
      ${ !suggestion.isLvl1 && !suggestion.isLvl1EmptyOrDuplicate ? `
      <span
        class="${suggestionPrefix}--category-header-lvl1 ${suggestionPrefix}--category-header-item"
      >
        ${suggestion.subcategory} </span
      >` : '' }` : '' }
      <div
        class="${suggestionPrefix}--title ${suggestionPrefix}--category-header-item"
      >
        ${suggestion.isLvl2 ? suggestion.title : ''} ${suggestion.isLvl1 ?
        suggestion.subcategory : ''} ${suggestion.isLvl0 ? suggestion.category :
        ''}
      </div>
    </div>
    <div class="${suggestionPrefix}--wrapper">
      ${ suggestion.text ? `
      <div class="${suggestionPrefix}--content">
        <div class="${suggestionPrefix}--text">${suggestion.text}</div>
      </div>
      ` : '' }
    </div>
  </div>
</template>
