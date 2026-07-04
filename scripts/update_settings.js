const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../app/dashboard/admin/settings/page.tsx')
let content = fs.readFileSync(filePath, 'utf8')

// 1. Inject Add/Remove Handlers
const handlersToInject = `
  const addHeroSlide = () => setSettings(prev => ({ ...prev, hero_slides: [...(prev.hero_slides || []), {}] }))
  const removeHeroSlide = (index: number) => setSettings(prev => ({ ...prev, hero_slides: (prev.hero_slides || []).filter((_, i) => i !== index) }))

  const addHeroTicker = () => setSettings(prev => ({ ...prev, hero_ticker_items: [...(prev.hero_ticker_items || []), {}] }))
  const removeHeroTicker = (index: number) => setSettings(prev => ({ ...prev, hero_ticker_items: (prev.hero_ticker_items || []).filter((_, i) => i !== index) }))

  const addHeroTrustAvatar = () => setSettings(prev => ({ ...prev, hero_trust_avatars: [...(prev.hero_trust_avatars || []), ''] }))
  const removeHeroTrustAvatar = (index: number) => setSettings(prev => ({ ...prev, hero_trust_avatars: (prev.hero_trust_avatars || []).filter((_, i) => i !== index) }))

  const addHeroStat = () => setSettings(prev => ({ ...prev, hero_stats: [...(prev.hero_stats || []), {}] }))
  const removeHeroStat = (index: number) => setSettings(prev => ({ ...prev, hero_stats: (prev.hero_stats || []).filter((_, i) => i !== index) }))

  const addExploreCategory = () => setSettings(prev => ({ ...prev, explore_categories: [...(prev.explore_categories || []), { title: '', count: '', image: '', link: '' }] }))
  const removeExploreCategory = (index: number) => setSettings(prev => ({ ...prev, explore_categories: (prev.explore_categories || []).filter((_, i) => i !== index) }))

  const addSubjectCategory = () => setSettings(prev => ({ ...prev, subject_categories: [...(prev.subject_categories || []), { id: '', name: '', image: '' }] }))
  const removeSubjectCategory = (index: number) => setSettings(prev => ({ ...prev, subject_categories: (prev.subject_categories || []).filter((_, i) => i !== index) }))

  const addFeaturedPub = () => setSettings(prev => ({ ...prev, featured_publications: [...(prev.featured_publications || []), {}] }))
  const removeFeaturedPub = (index: number) => setSettings(prev => ({ ...prev, featured_publications: (prev.featured_publications || []).filter((_, i) => i !== index) }))

  const addStep = () => setSettings(prev => ({ ...prev, how_it_works_steps: [...(prev.how_it_works_steps || []), { title: '', description: '' }] }))
  const removeStep = (index: number) => setSettings(prev => ({ ...prev, how_it_works_steps: (prev.how_it_works_steps || []).filter((_, i) => i !== index) }))
`

content = content.replace(
  'const addFaq = () => {', 
  handlersToInject + '\n  const addFaq = () => {'
)

// 2. Update Ticker Items UI
content = content.replace(
  'Top Ticker Items (3 Items)',
  'Top Ticker Items ({settings.hero_ticker_items?.length || 0} Items)'
)
content = content.replace(
  '<div className="grid grid-cols-[100px_1fr] gap-3">',
  '<div className="grid grid-cols-[100px_1fr] gap-3 relative">\n                      <button type="button" onClick={() => removeHeroTicker(index)} className="absolute -top-6 right-0 text-xs text-red-500 hover:text-red-700">Remove</button>'
)
content = content.replace(
  '</div>\n              </div>\n\n              {/* Trust Avatars */}',
  '</div>\n                <button type="button" onClick={addHeroTicker} className="mt-4 text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-medium hover:bg-indigo-100">+ Add Ticker Item</button>\n              </div>\n\n              {/* Trust Avatars */}'
)

// 3. Update Trust Avatars UI
content = content.replace(
  'Trust Avatars (4 Images)',
  'Trust Avatars ({settings.hero_trust_avatars?.length || 0} Images)'
)
content = content.replace(
  '<div>\n                      <ImageUpload label={`Avatar ${index + 1}`} value={avatar || \'\'} onChange={(url) => handleHeroTrustAvatarChange(index, url)} />\n                    </div>',
  '<div className="relative border p-3 rounded-lg">\n                      <button type="button" onClick={() => removeHeroTrustAvatar(index)} className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700 z-10">Remove</button>\n                      <ImageUpload label={`Avatar ${index + 1}`} value={avatar || \'\'} onChange={(url) => handleHeroTrustAvatarChange(index, url)} />\n                    </div>'
)
content = content.replace(
  '</div>\n              </div>\n\n              {/* Stats */}',
  '</div>\n                <button type="button" onClick={addHeroTrustAvatar} className="mt-4 text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-medium hover:bg-indigo-100">+ Add Trust Avatar</button>\n              </div>\n\n              {/* Stats */}'
)

// 4. Update Stats UI
content = content.replace(
  'Bottom Stats Bar (4 Stats)',
  'Bottom Stats Bar ({settings.hero_stats?.length || 0} Stats)'
)
content = content.replace(
  '<div key={index} className="space-y-3">',
  '<div key={index} className="space-y-3 relative border p-3 rounded-lg">\n                      <button type="button" onClick={() => removeHeroStat(index)} className="absolute -top-2 right-2 text-xs text-red-500 hover:text-red-700">Remove</button>'
)
content = content.replace(
  '</div>\n              </div>\n\n            </div>',
  '</div>\n                <button type="button" onClick={addHeroStat} className="mt-4 text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-medium hover:bg-indigo-100">+ Add Stat</button>\n              </div>\n\n            </div>'
)

// 5. Update Explore Categories
content = content.replace(
  'Explore Categories (Publication Formats)',
  'Explore Categories ({settings.explore_categories?.length || 0} Formats)'
)
content = content.replace(
  '<div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">',
  '<div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">\n                  <button type="button" onClick={() => removeExploreCategory(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>'
)
content = content.replace(
  '</div>\n              ))}\n            </div>',
  '</div>\n              ))}\n              <button type="button" onClick={addExploreCategory} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-medium hover:bg-indigo-100">+ Add Format</button>\n            </div>'
)

// 6. Update Subject Categories
content = content.replace(
  'Subject Categories (11 Disciplines)',
  'Subject Categories ({settings.subject_categories?.length || 0} Disciplines)'
)
content = content.replace(
  '<div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">',
  '<div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">\n                  <button type="button" onClick={() => removeSubjectCategory(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>'
)
content = content.replace(
  '</div>\n              ))}\n            </div>',
  '</div>\n              ))}\n              <button type="button" onClick={addSubjectCategory} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-medium hover:bg-indigo-100">+ Add Category</button>\n            </div>'
)

// 7. Update Hero Slides
content = content.replace(
  'Hero Carousel Slides (5 Slides)',
  'Hero Carousel Slides ({settings.hero_slides?.length || 0} Slides)'
)
content = content.replace(
  '<div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">',
  '<div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">\n                  <button type="button" onClick={() => removeHeroSlide(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>'
)
content = content.replace(
  '</div>\n              ))}\n            </div>',
  '</div>\n              ))}\n              <button type="button" onClick={addHeroSlide} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-medium hover:bg-indigo-100">+ Add Slide</button>\n            </div>'
)

// 8. Update Featured Publications
content = content.replace(
  'Featured Publications (4 Cards)',
  'Featured Publications ({settings.featured_publications?.length || 0} Cards)'
)
content = content.replace(
  '<div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">',
  '<div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">\n                  <button type="button" onClick={() => removeFeaturedPub(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>'
)
content = content.replace(
  '</div>\n              ))}\n            </div>',
  '</div>\n              ))}\n              <button type="button" onClick={addFeaturedPub} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-medium hover:bg-indigo-100">+ Add Publication</button>\n            </div>'
)

// 9. Update How It Works Steps
content = content.replace(
  'How It Works Steps (3 Steps)',
  'How It Works Steps ({settings.how_it_works_steps?.length || 0} Steps)'
)
content = content.replace(
  '<div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">',
  '<div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">\n                  <button type="button" onClick={() => removeStep(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>'
)
content = content.replace(
  '</div>\n              ))}\n            </div>',
  '</div>\n              ))}\n              <button type="button" onClick={addStep} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-medium hover:bg-indigo-100">+ Add Step</button>\n            </div>'
)

fs.writeFileSync(filePath, content, 'utf8')
console.log('Successfully updated settings page')
