<script setup lang="ts">
// add code here
</script>

<style lang="css" scoped>
h2 {
  @apply text-2xl text-center rounded rounded-b-none border-b-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1 py-2;
}

p {
  @apply p-4;
}

.content p {
  @apply p-1;
}
li {
  @apply list-circle list-inside;
}

.content {
  @apply flex flex-col space-y-2 border-1 border-t-0 p-2 rounded-md rounded-t-none border-gray-200 dark:border-gray-700;
}
</style>

<template>
  <div
    class="flex border-1 border-dotted border-gray-500 rounded p-2 w-full place-items-center"
  >
    <details class="w-full" open>
      <summary class="hover:bg-gray-100/25 cursor-pointer w-full p-1">
        Documentation
      </summary>

      <p>
        This search bar is intended to be exported as both a
        <span class="font-bold">Vue3 Component</span> <i>and</i> a framework
        neutral <span class="font-bold">custom Web Component</span>. If you're
        using VueJS then in all likelyhood using the VueJS Component is the
        better choice but for React, Angular, "pick your flavor of framework",
        or just plain vanilla ... all modern browsers should be able to use the
        Web Component.
      </p>

      <div class="p-4 flex flex-col space-y-2">
        <details>
          <summary>Meilisearch Look and Feel</summary>
          <img
            src="meili.png"
            alt="image of what meilisearch's own search bar looks like"
            class="max-w-90%"
          />
        </details>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 w-full pt-4">
          <div class="">
            <h2>Properties</h2>
            <div class="content">
              <search-property name="config" type="IConfig">
                the config property is required as it is used to tell the search
                bar where to find the Meilisearch server.
              </search-property>
              <separator />
              <search-property name="title" type="IMapper">
                <p>
                  Maps doc props to the primary text that shows up for a "search
                  hit".
                </p>
                <p>See <span>IMapper</span> interface for more details.</p>
              </search-property>
              <search-property name="sub-heading" type="IMapper">
                <p>
                  Maps doc props to the secondary text that shows up to the
                  right of the title.
                </p>
                <p>See <span>IMapper</span> interface for more details.</p>
              </search-property>
              <search-property name="separator" type="string">
                By default, there is only whitespace separating the "title" and
                the "subHeading" but you can put in any content that suits here.
                Note that if you choose the ":" character it will pad to the
                right of title but not the left, all other separators are evenly
                balanced margin on left and right.
              </search-property>

              <separator :dotted="true" width="50" class="opacity-50" />

              <search-property name="description" type="IMapper">
                <p>
                  If you want to reserve space for some longer content you can
                  put that into the description area which will be displayed
                  <i>below</i> the top line with the title and sub-heading.
                </p>
                <p>
                  Unlike the sub-heading, which is truncated at the end of the
                  line the description field can be multi-line. This is a
                  "feature" but to guard against run-away lengths see the
                  <b>descLength</b> prop.
                </p>
              </search-property>

              <search-property name="desc-length" type="number">
                <p>
                  Allows you to specify a maximum length of the content for the
                  mapped "description" content.
                </p>
              </search-property>
              <separator />

              <search-property name="group-by" type="keyof T">
                This property lets you pick a property from the
                Document&lt;T&gt; which all results will be grouped by.
              </search-property>
              <search-property name="sections" type="IMapper">
                A mapping of document properties to the anchor tags which
                represent your sections in a document. If this maps to a value
                it is assumed that "#VALUE" added to the URL is a valid link and
                will present these sections underneath the main page level link.
              </search-property>
              <search-property name="sub-sections" type="IMapper">
                Exactly the same as "sections" but this typically maps more to
                the H3 elements of a page versus the H2 elements in "sections".
              </search-property>
            </div>
          </div>
          <div>
            <h2>Properties</h2>
            <div class="content">
              <search-property name="distance" type="number">
                the number of pixels in separation there should be between the
                search bar and the popup dialog for results.
              </search-property>
              <search-property name="skidding" type="number">
                <!--  -->
              </search-property>
              <search-property name="placement" type="enum">
                <p>
                  The placement of the results popup relative to the search bar.
                </p>
              </search-property>

              <separator />

              <search-property name="kind" type="enum">
                <!--  -->
              </search-property>
              <search-property name="placeholder" type="string">
                <p>
                  The placeholder text to display in the search bar; by default
                  uses "Search".
                </p>
              </search-property>
              <search-property name="focus-key" type="enum">
                <p>
                  Allows a set of choices for hot keys which will give focus to
                  the search bar.
                </p>
                <p>
                  Note: this is independant from the "startTyping" property
                  which will automatically direct focus to search when a user
                  starts typing.
                </p>
              </search-property>

              <separator />

              <search-property name="limit" type="number | 'auto'">
                <p>
                  Limits the number of queries to a set number. Alternatively,
                  choosing "auto" allows the component to estimate the best
                  number of results to show based on the device's viewport size.
                </p>
              </search-property>
              <search-property name="offset" type="number">
                <p>
                  When a search is run against Meilisearch, it will return the
                  hits that fit into the "limit" size but it will also know the
                  total resultset size and while by default it always starts at
                  an offset of 0, you can change this to move deeper into the
                  resultset.
                </p>
              </search-property>
            </div>
          </div>
          <div>
            <h2>Slots</h2>
            <div class="content">
              <search-slot name="default" type="ISearchResults">
                <p>
                  Allows consumer to take over <i>all</i> rendering
                  responsibity. Consumer can pick necessary property and results
                  info from the <b>slot-props</b> provided.
                </p>
              </search-slot>
              <search-slot name="result" type="ISearchHit">
                <p>
                  Allows styling/rendering at the "hit level"; this slot
                  provides the resultant "search hit", along with other meta
                  properties so that the renderer can use to determine where
                  they are in the index, whether this item is in a "group", etc.
                </p>
              </search-slot>
              <search-slot name="group" type="IGroupHits">
                <p>
                  When a search is <i>grouped</i>, each group block with both
                  group meta as well the results for that block are provided to
                  the render to render the group block.
                </p>
              </search-slot>
              <search-slot name="doc-icon" type="ISearchHit">
                <p>
                  Allows consumer of this component to add an icon to each
                  document. Because the slot props provides the full document
                  dictionary, the consumer can react to the document that is
                  being rendered.
                </p>
              </search-slot>
              <search-slot name="group-icon" type="IGroupHits">
                <p>
                  Allows consumer of this component to add an icon to each
                  group. The slot-props provide full group and document context
                  so the consumer can react to the group which is being
                  rendered.
                </p>
              </search-slot>
            </div>

            <h2 class="mt-4">Emits</h2>
            <div class="content">
              <search-slot name="results" type="ISearchResults">
                <p>Emits an event each time the "search results" change.</p>
              </search-slot>
              <search-slot name="selected" type="ISelectedItem">
                <p>
                  When a list of search results is present, the user is able to
                  use the tab/shift-tab as well as up/down arrow keys to move
                  focus between the various search hits. Each time the
                  focused/selected item is changed this event will be fired.
                </p>
              </search-slot>
            </div>
            <h2 class="mt-4">Interfaces</h2>
            <div class="content">
              <search-interface
                name="IMapper"
                desc="map doc props to display props"
              >
                <p>
                  The <span class="font-bold">IMapper</span> interface is
                  intended to provide the means to
                  <span class="italic">map</span> one or more properties to
                  displayed properties in this component.
                </p>
                <p>
                  In it's most basic form it takes a single property name that's
                  expected on a search document. Sometimes, however, you might
                  want to look in a series of properties until you find text,
                  this too is easily achieved with an array of strings.
                  Alternatively you can simply pass in a comma-separated strings
                  and the string will be parsed into an array.
                </p>
                <p>
                  In cases where these two methods will not suffice you can take
                  more control by passing in a callback function:
                </p>
                <pre class="text-xs p-0"><code lang="html">
                  &lt;meili-searchbar title="doc => { ... }" /&gt;
                </code></pre>
              </search-interface>
              <search-interface name="ISearchHit" desc="slot-props payload">
                <p>
                  The "result" slot will receive slot-props shaped by the
                  <span class="font-bold">ISearchHit</span> interface. This
                  interface should provide all of the attributes to render a
                  non-grouped result however you like.
                </p>
              </search-interface>
              <search-interface name="IGroupHits" desc="slot-props payload">
                <p>
                  The "result" slot will receive slot-props shaped by the
                  <span class="font-bold">IGroupHits</span> interface when a
                  "groupBy" property was supplied. This interface should provide
                  all of the attributes to render the group and it's individual
                  search results.
                </p>
              </search-interface>
            </div>
          </div>
        </div>
      </div>
    </details>
  </div>
</template>
