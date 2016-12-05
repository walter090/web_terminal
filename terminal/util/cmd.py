import os


def cmd_ls(directory):
    return '    '.join(os.listdir(directory))


def prep_return(dict):
    temp_list = dict['dir'].split('/')
    temp_list.pop(0)
    dict['dir'] = '/' + '/'.join(temp_list)
    return dict


def cmd_cd(current_dir, arg):
    if current_dir == 'root/':
        current_dir = 'root'

    return_dict = {'dir': current_dir, 'message': ''}

    if arg is None:
        return return_dict

    arg_list = arg.split('/')
    return_dict['dir'] = ''

    if arg_list[0] == '':
        return_dict['dir'] = 'root'
        while arg_list[0] == '':
            if arg_list:
                arg_list.pop(0)
                if not arg_list:
                    return prep_return(return_dict)

        if not arg_list:
            return prep_return(return_dict)

    else:
        return_dict['dir'] = current_dir + '/'

    for dirname in arg_list:
        if dirname == '.':
            return_dict['dir'] = current_dir
            return prep_return(return_dict)
        if dirname == '..':
            return_dict['dir'] = os.path.dirname(os.path.dirname(return_dict['dir']))
            if return_dict['dir'] == 'root':
                return prep_return(return_dict)
            continue
        if dirname in os.listdir(return_dict['dir']):
            return_dict['dir'] = return_dict['dir'] + dirname
        else:
            return_dict['message'] = 'cd: ' + arg + ': No such file or directory'
            return prep_return(return_dict)

    return prep_return(return_dict)
