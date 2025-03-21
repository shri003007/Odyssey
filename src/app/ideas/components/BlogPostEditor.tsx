import { useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, Text, Input } from '@sparrowengg/twigs-react';
import { Pencil, Trash, Plus } from 'lucide-react';
import { BlogPostContent } from '../types';

interface BlogPostEditorProps {
  content: BlogPostContent;
  onContentChange: (content: BlogPostContent) => void;
}

const BlogPostEditor = ({ content, onContentChange }: BlogPostEditorProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [blogData, setBlogData] = useState({
    title: content.title,
    summary: content.summary,
    keywords: content.keywords || { primary: [], secondary: [] },
    outline: content.outline[0]
  });

  console.log(blogData, 'blogData');
  
  // Edit states
  const [editState, setEditState] = useState({
    title: false,
    summary: false,
    mainTitle: false,
    keywords: false,
    primaryKeyword: null as number | null,
    secondaryKeyword: null as number | null,
    sectionTitles: {} as Record<number, boolean>,
    subSections: {} as Record<string, boolean>
  });

  // Effect to sync changes back to parent
  useEffect(() => {
    const updatedContent: BlogPostContent = {
      ...content,
      title: blogData.title,
      summary: blogData.summary,
      keywords: blogData.keywords,
      outline: [blogData.outline]
    };
    onContentChange(updatedContent);
  }, [blogData]);

  // Helper to update a specific field in blogData
  const updateBlogData = (field: string, value: unknown) => {
    setBlogData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Generic handler for entering edit mode
  const enterEditMode = (field: string, sectionIndex?: number, subSectionKey?: string) => {
    if (sectionIndex !== undefined) {
      setEditState(prev => ({
        ...prev,
        sectionTitles: {
          ...prev.sectionTitles,
          [sectionIndex]: true
        }
      }));
    } else if (subSectionKey !== undefined) {
      setEditState(prev => ({
        ...prev,
        subSections: {
          ...prev.subSections,
          [subSectionKey]: true
        }
      }));
    } else {
      setEditState(prev => ({
        ...prev,
        [field]: true
      }));
    }
  };

  // Generic handler for saving edits
  const saveEdit = (field: string, value: unknown, sectionIndex?: number, subSectionKey?: string) => {
    if (sectionIndex !== undefined) {
      // Update section title
      const updatedOutline = { ...blogData.outline };
      updatedOutline.sections[sectionIndex].h2 = value as string;
      updateBlogData('outline', updatedOutline);
      
      setEditState(prev => ({
        ...prev,
        sectionTitles: {
          ...prev.sectionTitles,
          [sectionIndex]: false
        }
      }));
    } else if (subSectionKey !== undefined) {
      // Update subsection content (the key has format "sectionIndex-subSectionIndex")
      const [secIdx, subSecIdx] = subSectionKey.split('-').map(Number);
      const updatedOutline = { ...blogData.outline };
      updatedOutline.sections[secIdx].h3[subSecIdx] = value as string;
      updateBlogData('outline', updatedOutline);
      
      setEditState(prev => ({
        ...prev,
        subSections: {
          ...prev.subSections,
          [subSectionKey]: false
        }
      }));
    } else {
      // Update main field
      updateBlogData(field, value);
      setEditState(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  // Update main title
  const saveMainTitle = (value: string) => {
    const updatedOutline = { ...blogData.outline };
    updatedOutline.h1 = value;
    updateBlogData('outline', updatedOutline);
    setEditState(prev => ({ ...prev, mainTitle: false }));
  };

  // Add a new subsection to a specific section
  const addSubSection = (sectionIndex: number) => {
    const updatedOutline = { ...blogData.outline };
    updatedOutline.sections[sectionIndex].h3 = [
      ...updatedOutline.sections[sectionIndex].h3,
      "New subsection"
    ];
    updateBlogData('outline', updatedOutline);
    
    // Automatically open edit mode for the new subsection
    const newSubSectionIndex = updatedOutline.sections[sectionIndex].h3.length - 1;
    const subSectionKey = `${sectionIndex}-${newSubSectionIndex}`;
    
    setEditState(prev => ({
      ...prev,
      subSections: {
        ...prev.subSections,
        [subSectionKey]: true
      }
    }));
  };

  // Delete a subsection
  const deleteSubSection = (sectionIndex: number, subSectionIndex: number) => {
    const updatedOutline = { ...blogData.outline };
    updatedOutline.sections[sectionIndex].h3 = updatedOutline.sections[sectionIndex].h3.filter(
      (_, idx) => idx !== subSectionIndex
    );
    updateBlogData('outline', updatedOutline);
  };

  return (
    <Box css={{ width: '100%', marginBottom: '$8' }}>
      {/* Blog Post Title Section */}
      <Box
        css={{ 
          border: '1px solid $secondary200', 
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <Flex 
          alignItems="center" 
          justifyContent="space-between" 
          css={{ 
            padding: '$4 $6',
            backgroundColor: 'white',
            borderBottom: isExpanded ? '1px solid $secondary200' : 'none',
            cursor: 'pointer'
          }}
          onClick={toggleExpanded}
        >
          <Heading 
            css={{ 
              fontSize: '$xl', 
              fontWeight: '$7', 
              color: '$neutral900',
              position: 'relative',
              '&:hover .edit-icon': {
                opacity: 1
              }
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              enterEditMode('title');
            }}
          >
            {blogData.title}
          </Heading>
          <Button 
            css={{ backgroundColor: 'transparent', color: '$neutral900', padding: 0 }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              toggleExpanded();
            }}
          >
            {isExpanded ? '▲' : '▼'}
          </Button>
        </Flex>
        
        {isExpanded && (
          <Box css={{ padding: '$6' }}>
            {/* Summary Section */}
            <Box css={{ marginBottom: '$6' }}>
              <Flex alignItems="center" justifyContent="space-between" css={{ marginBottom: '$2' }}>
                <Text css={{ fontWeight: '$6', color: '$neutral700' }}>Summary</Text>
              </Flex>
              <Text css={{ color: '$neutral800' }}>
                {blogData.summary}
              </Text>
            </Box>

            {/* Keywords Section */}
            <Box css={{ marginBottom: '$6' }}>
              <Flex alignItems="center" justifyContent="space-between" css={{ marginBottom: '$2' }}>
                <Text css={{ fontWeight: '$6', color: '$neutral700' }}>Keywords</Text>
              </Flex>

              <Box css={{ marginBottom: '$4' }}>
                <Text css={{ fontWeight: '$6', marginBottom: '$2' }}>Primary Keywords</Text>
                <Box css={{ marginBottom: '$4' }}>
                  {blogData.keywords.primary.length > 0 ? (
                    <Flex wrap="wrap" gap="$2">
                      {blogData.keywords.primary.map((keyword, idx) => (
                        <Flex 
                          key={idx}
                          alignItems="center"
                          css={{
                            backgroundColor: '$accent100',
                            padding: '$2 $3',
                            borderRadius: '$2',
                            gap: '$2'
                          }}
                        >
                          {editState.primaryKeyword === idx ? (
                            <Input
                              value={keyword}
                              autoFocus
                              css={{ 
                                width: '120px',
                                height: '24px',
                                fontSize: '$sm'
                              }}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const updatedKeywords = [...blogData.keywords.primary];
                                updatedKeywords[idx] = e.target.value;
                                updateBlogData('keywords', {
                                  ...blogData.keywords,
                                  primary: updatedKeywords
                                });
                              }}
                              onBlur={() => setEditState(prev => ({...prev, primaryKeyword: null}))}
                              onKeyDown={(e: React.KeyboardEvent) => {
                                if (e.key === 'Enter') {
                                  setEditState(prev => ({...prev, primaryKeyword: null}));
                                }
                              }}
                            />
                          ) : (
                            <>
                              <Text css={{ color: '$accent700', fontSize: '$sm' }}>
                                {keyword}
                              </Text>
                              <Flex gap="$1">
                                <Button
                                  variant="ghost"
                                  css={{ 
                                    padding: 0,
                                    minWidth: 'auto',
                                    color: '$accent700',
                                    '&:hover': {
                                      backgroundColor: 'transparent',
                                      opacity: 0.8
                                    }
                                  }}
                                  onClick={() => setEditState(prev => ({...prev, primaryKeyword: idx}))}
                                >
                                  <Pencil size={14} />
                                </Button>
                                <Button
                                  variant="ghost" 
                                  css={{ 
                                    padding: 0,
                                    minWidth: 'auto',
                                    color: '$danger500',
                                    '&:hover': {
                                      backgroundColor: 'transparent',
                                      opacity: 0.8
                                    }
                                  }}
                                  onClick={() => {
                                    const updatedKeywords = blogData.keywords.primary.filter((_, i) => i !== idx);
                                    updateBlogData('keywords', {
                                      ...blogData.keywords,
                                      primary: updatedKeywords
                                    });
                                  }}
                                >
                                  <Trash size={14} />
                                </Button>
                              </Flex>
                            </>
                          )}
                        </Flex>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        css={{ 
                          padding: '$2',
                          color: '$accent500',
                          border: '1px dashed $accent300',
                          borderRadius: '$2',
                          '&:hover': {
                            backgroundColor: '$accent50'
                          }
                        }}
                        onClick={() => {
                          updateBlogData('keywords', {
                            ...blogData.keywords,
                            primary: [...blogData.keywords.primary, '']
                          });
                          setEditState(prev => ({...prev, primaryKeyword: blogData.keywords.primary.length}));
                        }}
                      >
                        <Plus size={14} />
                        <Text css={{ marginLeft: '$1', fontSize: '$sm' }}>Add Keyword</Text>
                      </Button>
                    </Flex>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm" 
                      css={{ 
                        padding: '$2',
                        color: '$accent500',
                        border: '1px dashed $accent300',
                        borderRadius: '$2',
                        '&:hover': {
                          backgroundColor: '$accent50'
                        }
                      }}
                      onClick={() => {
                        updateBlogData('keywords', {
                          ...blogData.keywords,
                          primary: ['']
                        });
                        setEditState(prev => ({...prev, primaryKeyword: 0}));
                      }}
                    >
                      <Plus size={14} />
                      <Text css={{ marginLeft: '$1', fontSize: '$sm' }}>Add Primary Keyword</Text>
                    </Button>
                  )}
                </Box>

                <Text css={{ fontWeight: '$6', marginBottom: '$2', marginTop: '$6' }}>Secondary Keywords</Text>
                <Box css={{ marginBottom: '$2' }}>
                  {blogData.keywords.secondary.length > 0 ? (
                    <Flex wrap="wrap" gap="$2">
                      {blogData.keywords.secondary.map((keyword, idx) => (
                        <Flex 
                          key={idx}
                          alignItems="center"
                          css={{
                            backgroundColor: '$secondary50',
                            padding: '$2 $3',
                            borderRadius: '$2',
                            gap: '$2'
                          }}
                        >
                          {editState.secondaryKeyword === idx ? (
                            <Input
                              value={keyword}
                              autoFocus
                              css={{ 
                                width: '120px',
                                height: '24px',
                                fontSize: '$sm'
                              }}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const updatedKeywords = [...blogData.keywords.secondary];
                                updatedKeywords[idx] = e.target.value;
                                updateBlogData('keywords', {
                                  ...blogData.keywords,
                                  secondary: updatedKeywords
                                });
                              }}
                              onBlur={() => setEditState(prev => ({...prev, secondaryKeyword: null}))}
                              onKeyDown={(e: React.KeyboardEvent) => {
                                if (e.key === 'Enter') {
                                  setEditState(prev => ({...prev, secondaryKeyword: null}));
                                }
                              }}
                            />
                          ) : (
                            <>
                              <Text css={{ color: '$secondary700', fontSize: '$sm' }}>
                                {keyword}
                              </Text>
                              <Flex gap="$1">
                                <Button
                                  variant="ghost"
                                  css={{ 
                                    padding: 0,
                                    minWidth: 'auto',
                                    color: '$secondary700',
                                    '&:hover': {
                                      backgroundColor: 'transparent',
                                      opacity: 0.8
                                    }
                                  }}
                                  onClick={() => setEditState(prev => ({...prev, secondaryKeyword: idx}))}
                                >
                                  <Pencil size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  css={{ 
                                    padding: 0,
                                    minWidth: 'auto',
                                    color: '$danger500',
                                    '&:hover': {
                                      backgroundColor: 'transparent',
                                      opacity: 0.8
                                    }
                                  }}
                                  onClick={() => {
                                    const updatedKeywords = blogData.keywords.secondary.filter((_, i) => i !== idx);
                                    updateBlogData('keywords', {
                                      ...blogData.keywords,
                                      secondary: updatedKeywords
                                    });
                                  }}
                                >
                                  <Trash size={14} />
                                </Button>
                              </Flex>
                            </>
                          )}
                        </Flex>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        css={{ 
                          padding: '$2',
                          color: '$secondary500',
                          border: '1px dashed $secondary300',
                          borderRadius: '$2',
                          '&:hover': {
                            backgroundColor: '$secondary50'
                          }
                        }}
                        onClick={() => {
                          updateBlogData('keywords', {
                            ...blogData.keywords,
                            secondary: [...blogData.keywords.secondary, '']
                          });
                          setEditState(prev => ({...prev, secondaryKeyword: blogData.keywords.secondary.length}));
                        }}
                      >
                        <Plus size={14} />
                        <Text css={{ marginLeft: '$1', fontSize: '$sm' }}>Add Keyword</Text>
                      </Button>
                    </Flex>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      css={{ 
                        padding: '$2',
                        color: '$secondary500',
                        border: '1px dashed $secondary300',
                        borderRadius: '$2',
                        '&:hover': {
                          backgroundColor: '$secondary50'
                        }
                      }}
                      onClick={() => {
                        updateBlogData('keywords', {
                          ...blogData.keywords,
                          secondary: ['']
                        });
                        setEditState(prev => ({...prev, secondaryKeyword: 0}));
                      }}
                    >
                      <Plus size={14} />
                      <Text css={{ marginLeft: '$1', fontSize: '$sm' }}>Add Secondary Keyword</Text>
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Outline Section */}
            <Box css={{ marginTop: '$6' }}>
              <Flex alignItems="center" justifyContent="space-between" css={{ marginBottom: '$4' }}>
                <Text css={{ fontWeight: '$6', color: '$neutral700' }}>Outline</Text>
              </Flex>

              {/* Main Title */}
              <Flex alignItems="center" justifyContent="space-between" css={{ marginBottom: '$4' }}>
                {editState.mainTitle ? (
                  <Input 
                    value={blogData.outline.h1}
                    autoFocus
                    css={{ fontSize: '$lg', fontWeight: '$7', width: '90%' }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const updatedOutline = { ...blogData.outline };
                      updatedOutline.h1 = e.target.value;
                      updateBlogData('outline', updatedOutline);
                    }}
                    onBlur={() => saveMainTitle(blogData.outline.h1)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter') {
                        saveMainTitle(blogData.outline.h1);
                      }
                    }}
                  />
                ) : (
                  <Text 
                    css={{ 
                      fontWeight: '$7', 
                      fontSize: '$lg', 
                      color: '$neutral900',
                      position: 'relative',
                      '&:hover .edit-icon': {
                        opacity: 1
                      }
                    }}
                  >
                    {blogData.outline.h1}
                    <Text css={{ 
                      position: 'absolute', 
                      right: '-24px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      cursor: 'pointer'
                    }} 
                    className="edit-icon"
                    onClick={() => enterEditMode('mainTitle')}
                    >✏️</Text>
                  </Text>
                )}
              </Flex>

              {/* Sections */}
              {blogData.outline.sections.map((section, sIndex) => (
                <Box key={sIndex} css={{ marginBottom: '$4' }}>
                  <Flex 
                    alignItems="center" 
                    justifyContent="space-between"
                    css={{ 
                      cursor: 'pointer',
                      padding: '$2',
                      borderRadius: '$1',
                      '&:hover': {
                        backgroundColor: '$secondary50'
                      }
                    }}
                  >
                    <Flex alignItems="center" css={{ width: '100%' }}>
                      {editState.sectionTitles[sIndex] ? (
                        <Input 
                          value={section.h2}
                          autoFocus
                          css={{ fontWeight: '$6', color: '$neutral800', width: '90%' }}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updatedOutline = { ...blogData.outline };
                            updatedOutline.sections[sIndex].h2 = e.target.value;
                            updateBlogData('outline', updatedOutline);
                          }}
                          onBlur={() => saveEdit('sectionTitle', section.h2, sIndex)}
                          onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter') {
                              saveEdit('sectionTitle', section.h2, sIndex);
                            }
                          }}
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        />
                      ) : (
                        <Text 
                          css={{ 
                            fontWeight: '$6', 
                            color: '$neutral800',
                            position: 'relative',
                            '&:hover .edit-icon': {
                              opacity: 1
                            }
                          }}
                        >
                          {section.h2}
                          <Text css={{ 
                            position: 'absolute', 
                            right: '-24px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            opacity: 0,
                            transition: 'opacity 0.2s ease',
                            cursor: 'pointer'
                          }} 
                          className="edit-icon"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            enterEditMode('sectionTitle', sIndex);
                          }}
                          >✏️</Text>
                        </Text>
                      )}
                    </Flex>
                    {!editState.sectionTitles[sIndex] && (
                      <Button variant="ghost" size="sm" css={{ padding: '$1 $2' }} onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        enterEditMode('sectionTitle', sIndex);
                      }}>
                        Edit
                      </Button>
                    )}
                  </Flex>

                  {/* Subsections */}
                  <Box css={{ paddingLeft: '$6', marginTop: '$2' }}>
                    {section.h3.map((subSection, ssIndex) => (
                      <Flex 
                        key={ssIndex} 
                        css={{ 
                          marginBottom: '$2',
                          position: 'relative',
                          '&:hover .edit-icon, &:hover .delete-icon': {
                            opacity: 1
                          }
                        }}
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        {editState.subSections[`${sIndex}-${ssIndex}`] ? (
                          <Input 
                            value={subSection}
                            autoFocus
                            css={{ color: '$neutral700', width: '90%' }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const updatedOutline = { ...blogData.outline };
                              updatedOutline.sections[sIndex].h3[ssIndex] = e.target.value;
                              updateBlogData('outline', updatedOutline);
                            }}
                            onBlur={() => saveEdit('subSection', subSection, undefined, `${sIndex}-${ssIndex}`)}
                            onKeyDown={(e: React.KeyboardEvent) => {
                              if (e.key === 'Enter') {
                                saveEdit('subSection', subSection, undefined, `${sIndex}-${ssIndex}`);
                              }
                            }}
                          />
                        ) : (
                          <Flex alignItems="center" css={{ width: '100%' }}>
                            <Text css={{ marginRight: '$2' }}>•</Text>
                            <Text css={{ color: '$neutral700' }}>
                              {subSection}
                            </Text>
                            <Flex css={{ 
                              position: 'absolute', 
                              right: '80px',
                              opacity: 1,
                              transition: 'opacity 0.2s ease'
                            }}>
                              <Text 
                                css={{ 
                                  cursor: 'pointer',
                                  marginRight: '$2'
                                }} 
                                className="edit-icon"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  enterEditMode('subSection', undefined, `${sIndex}-${ssIndex}`);
                                }}
                              >✏️</Text>
                              <Text 
                                css={{ 
                                  cursor: 'pointer',
                                  color: '$danger500'
                                }} 
                                className="delete-icon"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  deleteSubSection(sIndex, ssIndex);
                                }}
                              >🗑️</Text>
                            </Flex>
                          </Flex>
                        )}
                      </Flex>
                    ))}
                    <Flex css={{ marginTop: '$2', paddingLeft: '$2' }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        css={{ padding: '$1', color: '$accent500' }}
                        onClick={() => addSubSection(sIndex)}
                      >
                        + Add Subsection
                      </Button>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BlogPostEditor; 